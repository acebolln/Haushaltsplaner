import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { extractReceiptData } from '@/lib/receipts/extraction'
import { receiptExtractionSchema } from '@/lib/receipts/validation'
import { checkRateLimit, getClientIdentifier } from '@/lib/security/rate-limiter'
import type { GoogleSession } from '@/types/google'

// Session configuration
const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'google_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 14, // 14 days
  },
}

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * POST /api/receipts/analyze
 * Analyzes a receipt image using Claude Vision API
 *
 * Request body:
 * {
 *   image: string (base64 encoded image without data URI prefix)
 *   mimeType: string (e.g., "image/jpeg")
 * }
 *
 * Response:
 * {
 *   merchantName: string
 *   date: string (YYYY-MM-DD)
 *   totalAmount: number (in cents)
 *   lineItems: Array<{description, quantity, unitPrice, totalPrice}>
 *   suggestedCategory: string
 *   confidence: "high" | "medium" | "low"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getIronSession<GoogleSession>(
      await cookies(),
      sessionOptions
    )

    if (!session.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized - please sign in with Google' },
        { status: 401 }
      )
    }

    // Rate limiting: 10 requests per 5 minutes per client
    const clientId = getClientIdentifier(request)
    const rateLimit = checkRateLimit(clientId, 10, 5 * 60 * 1000)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter || 60),
          },
        }
      )
    }

    // Parse request body
    const body = await request.json()
    const { image, mimeType } = body

    console.log('[Receipt Analysis] Request received:', {
      hasImage: !!image,
      imageLength: image?.length,
      mimeType,
    })

    // Validate inputs
    if (!image || typeof image !== 'string') {
      console.error('[Receipt Analysis] Missing or invalid image')
      return NextResponse.json(
        { error: 'Bild erforderlich (Base64-kodiert)' },
        { status: 400 }
      )
    }

    if (!mimeType || typeof mimeType !== 'string') {
      console.error('[Receipt Analysis] Missing or invalid MIME type')
      return NextResponse.json(
        { error: 'MIME-Typ erforderlich' },
        { status: 400 }
      )
    }

    // Validate MIME type
    const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
    if (!validMimeTypes.includes(mimeType.toLowerCase())) {
      return NextResponse.json(
        { error: 'Ungültiges Format. Erlaubt: JPEG, PNG, WEBP, PDF' },
        { status: 400 }
      )
    }

    // Validate image size (max 10MB)
    // Base64 is ~33% larger than binary, so we calculate actual size
    const imageSizeBytes = (image.length * 3) / 4
    const maxSizeBytes = 10 * 1024 * 1024 // 10MB

    if (imageSizeBytes > maxSizeBytes) {
      const sizeMB = (imageSizeBytes / (1024 * 1024)).toFixed(2)
      return NextResponse.json(
        {
          error: `Image too large (${sizeMB}MB). Maximum size: 10MB`,
        },
        { status: 413 }
      )
    }

    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not configured')
      return NextResponse.json(
        { error: 'API-Schlüssel nicht konfiguriert' },
        { status: 500 }
      )
    }

    // Call Claude API (Vision for images, Document for PDFs)
    console.log(`[Receipt Analysis] Calling Claude API (${mimeType})...`)

    const isPdf = mimeType === 'application/pdf'
    const contentBlock = isPdf
      ? {
          type: 'document' as const,
          source: {
            type: 'base64' as const,
            media_type: 'application/pdf' as const,
            data: image,
          },
        }
      : {
          type: 'image' as const,
          source: {
            type: 'base64' as const,
            media_type: mimeType as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
            data: image,
          },
        }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: [
            contentBlock,
            {
              type: 'text',
              text: extractReceiptData(),
            },
          ],
        },
      ],
    })
    console.log('[Receipt Analysis] Claude API response received')

    // Extract text response
    const textContent = message.content.find((block) => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      return NextResponse.json(
        { error: 'Keine Textantwort von Claude API erhalten' },
        { status: 500 }
      )
    }

    // Parse JSON response
    let extractedData
    const rawText = textContent.text

    // Step 1: Strip markdown code fences
    let jsonText = rawText
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim()

    // Step 2: Try direct parse first
    try {
      extractedData = JSON.parse(jsonText)
    } catch (firstError) {
      console.error('[Receipt Analysis] First parse failed, trying extraction...')
      console.error('[Receipt Analysis] Parse error:', firstError instanceof Error ? firstError.message : firstError)

      // Step 3: Extract the outermost JSON object using brace counting
      try {
        const startIdx = jsonText.indexOf('{')
        if (startIdx === -1) throw new Error('No JSON object found')

        let depth = 0
        let endIdx = -1
        let inString = false
        let escape = false

        for (let i = startIdx; i < jsonText.length; i++) {
          const ch = jsonText[i]

          if (escape) { escape = false; continue }
          if (ch === '\\' && inString) { escape = true; continue }
          if (ch === '"' && !escape) { inString = !inString; continue }
          if (inString) continue

          if (ch === '{') depth++
          else if (ch === '}') {
            depth--
            if (depth === 0) { endIdx = i; break }
          }
        }

        if (endIdx === -1) throw new Error('Unbalanced braces in JSON')

        const extracted = jsonText.substring(startIdx, endIdx + 1)
        extractedData = JSON.parse(extracted)
      } catch (secondError) {
        console.error('[Receipt Analysis] Extraction also failed:', secondError instanceof Error ? secondError.message : secondError)
        console.error('[Receipt Analysis] Raw response (first 1000 chars):', rawText.substring(0, 1000))
        return NextResponse.json(
          { error: 'Claude-Antwort konnte nicht als JSON geparst werden. Bitte erneut versuchen.' },
          { status: 500 }
        )
      }
    }

    // Validate with Zod schema
    const validationResult = receiptExtractionSchema.safeParse(extractedData)

    if (!validationResult.success) {
      console.error('[Receipt Analysis] Validation failed:', validationResult.error)
      console.error('[Receipt Analysis] Extracted data:', extractedData)
      return NextResponse.json(
        {
          error: 'Extrahierte Daten sind ungültig',
          details: validationResult.error.issues,
        },
        { status: 422 }
      )
    }

    console.log('[Receipt Analysis] Success! Returning validated data')
    // Return validated data
    return NextResponse.json(validationResult.data, { status: 200 })

  } catch (error) {
    console.error('Receipt analysis error:', error)

    // Handle Anthropic API errors
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        {
          error: 'Claude API Fehler',
          details: error.message,
        },
        { status: error.status || 500 }
      )
    }

    // Generic error
    return NextResponse.json(
      { error: 'Fehler bei der Beleganalyse' },
      { status: 500 }
    )
  }
}

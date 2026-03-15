# Test Claude API Integration

Test the Claude API receipt analysis endpoint.

## Steps

1. **Check environment**:
   - Verify ANTHROPIC_API_KEY is set in .env.local
   - Verify API route exists at `app/api/receipts/analyze/route.ts`

2. **Prepare test image**:
   - Use a sample receipt image (JPG/PNG)
   - Convert to base64
   - Max 10MB

3. **Test API endpoint**:
   ```bash
   curl -X POST http://localhost:3000/api/receipts/analyze \
     -H "Content-Type: application/json" \
     -d '{"imageBase64": "..."}'
   ```

4. **Validate response**:
   - Check structure: merchant, date, total, items[], category, confidence
   - Verify date format (ISO 8601)
   - Verify confidence is 0-100
   - Verify category is valid
   - Check items array structure

5. **Test error cases**:
   - Invalid image format
   - Image too large
   - Missing API key
   - API timeout

## Expected Response Format

```json
{
  "merchant": "REWE",
  "date": "2024-03-15",
  "total": 45.67,
  "items": [
    {"name": "Milch", "price": 1.29},
    {"name": "Brot", "price": 2.49}
  ],
  "category": "Lebensmittel",
  "confidence": 95
}
```

## Notes
- Run dev server first: `npm run dev`
- Keep sample receipt images in `public/test-receipts/`
- Log full request/response for debugging
- Check Anthropic API dashboard for usage

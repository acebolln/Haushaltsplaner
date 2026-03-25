---
name: appvantage-brand
description: >
  Appvantage corporate identity and visual design system.
  Use this skill whenever creating ANY content for or about Appvantage —
  presentations (PPTX), proposals, marketing materials, social media posts,
  email drafts, website content, internal docs, HTML reports, dashboards,
  web apps, or client-facing documents. Also trigger when reviewing existing
  Appvantage content for brand compliance, when someone mentions "brand
  guidelines", "Appvantage style", "Appvantage colours", "Appvantage font",
  or when generating visuals, colour palettes, or slide designs for Appvantage.
  Trigger whenever someone asks which colours, fonts, or tone to use for any
  Appvantage output — even if they don't explicitly mention "brand". This skill
  is the single source of truth for Appvantage's visual identity.
---

# Appvantage Brand System

Single source of truth for Appvantage's brand identity — visual and messaging standards, implementation tokens, and code patterns. Use as the authoritative reference for all brand decisions across PPTX, HTML, React, and web artifacts.

---

## Theme Selection — ALWAYS ASK

Before producing any output, determine which theme mode to use. **Prompt the user** unless the context is unambiguous.

### Smart Defaults

| Context | Default Mode | Ask User? |
|---------|-------------|-----------|
| Presentations (PPTX) — client-facing | Dark | Yes — "Would you like the dark or white template?" |
| Presentations (PPTX) — internal | White | Yes — "Would you like the dark or white template?" |
| Marketing materials / landing pages | Dark | Yes |
| Internal Docs / Reports / HTML | White | Yes |
| Dashboards / Web Apps | Dark | Yes — "Dark or white theme?" |
| Client Proposals | White | Yes |
| React Components | Dark | Yes — "Dark or white theme for this component?" |

**If the user says "Appvantage deck" or "Appvantage presentation" without specifying:** Default to dark but confirm: _"I'll use the dark template — would you prefer the white version instead?"_

**If the user explicitly states a mode:** Apply it without re-asking.

### Quick Reference: Dark vs White

| Element | Dark Mode | White Mode |
|---------|-----------|------------|
| Background | `#000000` | `#FFFFFF` |
| Card / Panel | `#111111` | `#F5F5F5` |
| Primary text | `#FFFFFF` | `#000000` |
| **All Headings (H1–H6)** | **White `#FFFFFF`** | **Black `#000000`** |
| Body text | `#FFFFFF` | `#333333` |
| Secondary / Caption | `#808080` | `#808080` |
| Footer text | `#808080` (was `#595959`) | `#808080` |
| Accent (CTAs, links, stat numbers, section labels) | `#E6035F` | `#E6035F` |
| Accent hover | `#C40250` | `#C40250` |
| Border / Divider | `#1A1A1A` | `#E8E8E8` |
| Logo asset | `logo25-white.png` | `logo25-black.png` |
| Nav background | `#000000` | `#FFFFFF` |
| Icons | White (Lucide line) | Black (Lucide line) |
| Icon CTA/interactive | `#E6035F` | `#E6035F` |

**Key rules:**
- **Headings are always white (dark mode) or black (white mode)** — never pink. This ensures maximum legibility (21:1 contrast) at all sizes.
- **Signature Pink is for accents only** — CTAs, buttons, links, stat callout numbers, section labels, and interactive states. Never for headings or body text.
- **Footer text uses `#808080`** (not the old `#595959` which failed WCAG at 3.00:1). All grey text now passes WCAG AA at minimum 5.32:1 on black.
- **Minimum grey on black is `#808080`** (5.32:1 contrast). Never use anything darker than `#808080` for text on `#000000` or `#111111` backgrounds.

---

## Logo

The logo is **appvantage>** — all lowercase. The `>` is a custom graphic chevron, not a typographic character.

> **The chevron is a graphic asset, not a symbol.** It cannot be reproduced by typing `>`, `&gt;`, or any Unicode/font character. The proportions, weight, and rounded terminals of the brand chevron are unique to the asset files. Any text-rendered `>` will always look wrong.

**Logo asset files:**
- `logo25-white.png` — use on dark backgrounds (default for dark-mode output)
- `logo25-black.png` — use on light/white backgrounds

**Always use the logo as an `<img>` tag or inserted image. Never reconstruct it in HTML/CSS/text.**

| Element | Colour | Hex |
|---------|--------|-----|
| Wordmark (app) | White on dark / Black on light | `#FFFFFF` / `#000000` |
| Wordmark (vantage) | Signature Pink | `#E6035F` |
| Chevron graphic | Chevron Grey | `#a5a9ab` |
| Tagline | Tagline Grey | `#808080` |

**Logo Usage Rules:**
- Always insert as image asset — never type or render the wordmark or chevron in code
- Always use on a clean background — white or black only
- Never recolour, stretch, skew, rotate, or add effects
- Never use "AppVantage", "App Vantage", or "APV"

**Clear Space:** Minimum = height of the lowercase "a" on all sides.
**Minimum Size:** Digital 80px wide / Print 25mm wide. Tagline may be omitted at small sizes.

### Skill Asset Files

Brand assets are bundled with this skill at `/mnt/skills/user/appvantage-brand/`.

| File | Usage |
|------|-------|
| `logo25-white.png` | Logo for dark mode — white wordmark on transparent |
| `logo25-black.png` | Logo for white mode — black wordmark on transparent |
| `tagline25-white.png` | Logo + tagline for dark mode |
| `tagline25-black.png` | Logo + tagline for white mode |
| `logosymbol.png` | Chevron symbol — pink background (social media, favicons) |
| `logosymbol-grey.png` | Chevron symbol — grey background |
| `logosymbol_Social_Media__Without_rounded_corners_.png` | Chevron symbol — pink, square (no rounded corners) |
| `fonnts_com-Acumin_Pro_Light.otf` | Acumin Pro Light font file |
| `auto-retain-logo.png` | AutoRetain full wordmark — marketing, decks, hero sections |
| `retain-admin-logo.png` | AutoRetain "R" symbol — in-app branding, sidebar, nav bar |
| `retain-fav-icon.png` | AutoRetain "R" symbol — favicon, app icon, PWA |

**Dark mode backgrounds** (black base, content left, visual right):

| File | Theme | Best for |
|------|-------|----------|
| `black-car.png` | Sports car in chevron | Automotive, Retain, mobility |
| `black-crowd.png` | Silhouetted crowd in motion | Enterprise, customers, people, market |
| `black-globe.png` | Tech globe with data particles | Sustainability, innovation, global reach, ESG |
| `black-highway.png` | City highway with light trails | Infrastructure, scale, logistics |
| `black-plain.png` | Chevron motif only | General purpose, clean/minimal |

**White mode backgrounds** (white base, content left, visual right):

| File | Theme | Best for |
|------|-------|----------|
| `white-car.jpg` | Sports car (soft/light treatment) | Automotive, Retain (white mode) |
| `white-crowd.jpg` | Crowd (light tint overlay) | Enterprise, people (white mode) |
| `white-globe.jpg` | Globe (light treatment) | Sustainability, global (white mode) |
| `white-highway.jpg` | Highway (light treatment) | Infrastructure, scale (white mode) |
| `white-plain.jpg` | Chevron motif only (light) | General purpose (white mode) |

> **ABSOLUTE RULE — always base64-embed assets in HTML output.** When generating any HTML file (whether for file output or artifact/iframe preview), ALL brand assets — logos, backgrounds, and the Acumin Pro font — MUST be base64-encoded and embedded inline. Never use relative file paths (`src="logo25-white.png"`) or external URLs in the HTML itself, because the rendered preview always runs in a sandboxed iframe where relative paths will break. The workflow is:
> 1. Read the asset file from `/mnt/skills/user/appvantage-brand/` using Python
> 2. Base64-encode it
> 3. Embed as `src="data:image/png;base64,..."` for images or `url(data:font/opentype;base64,...) format('opentype')` for fonts
> 4. Still copy the final HTML to `/mnt/user-data/outputs/` as normal
>
> This applies to logos, background images (`black-*.png`, `white-*.jpg`), `fonnts_com-Acumin_Pro_Light.otf`, AND the favicon (`logosymbol.png` for Appvantage pages, `retain-fav-icon.png` for AutoRetain pages). No exceptions — every HTML output must be fully self-contained and include a branded favicon.

**Source of truth:** These asset files originate from the SharePoint folder `Appvantage-Logo+25` and `APV Backgrounds`. The canonical versions are also referenced on the Confluence Brand Visual page at `https://appvantage.atlassian.net/wiki/spaces/AD/pages/35946504/Appvantage+Brand+Visual`.

> **ABSOLUTE RULE — no text-rendered logos.** The logo is ALWAYS an `<img>` tag pointing to `logo25-white.png` or `logo25-black.png` (or their base64-encoded equivalents). Never render the wordmark as styled HTML text (e.g., `<span>app</span><span>vantage</span>`) — not even as a "fallback". The logo contains custom letterforms and a proprietary chevron that cannot be reproduced in any font or code. If the image file is not available, show nothing rather than a text approximation.

> **ABSOLUTE RULE — no website-sourced images.** Never use images from the live website (`appvantage.co` or `framerusercontent.com` URLs). Always use the original asset files from the skill folder, SharePoint, or Confluence Brand Visual page.

---

## Tagline

> **driving sustainable innovation**

Always set in all lowercase — deliberate design choice, not a typo. In Acumin Pro Light at Tagline Grey (`#808080`) when paired with the logo.

---

## Brand Story

### Who Is Appvantage?

Founded in 2011 in Singapore. Design-driven, mobile-first. Originally automotive-focused, now a multi-industry AI innovator. 200+ applications deployed across 20+ countries. Clients include Porsche, Eurokars, Cycle & Carriage, Mercedes-Benz/Daimler. TISAX-certified (Deloitte-audited).

### Mission

We empower enterprises with AI-driven, mobile solutions that revolutionise application design and user experience.

### Vision

Leading the future of enterprises with transformative AI-driven digital solutions that redefine application design, revolutionise e-commerce, enhance user and customer experiences.

### Core Values

| Value | Description |
|-------|-------------|
| Innovation | We cultivate a culture where creativity, thoughtful design, and new ideas thrive |
| Mindfulness | We encourage our people to be sensitive to all around, prioritizing thoughtful consideration and kindness |
| Passion | We bring enthusiasm and dedication to our work, relentlessly pursuing excellence |
| Agility | We embrace flexibility and adaptability, swiftly responding to changes and seizing new opportunities |
| Customer Obsession | We make the needs and feedback of our customers the cornerstone of our business |
| Trust | Through transparency and integrity, we nurture strong relationships and encourage ethical behaviour |

### Key Milestones

| Year | Milestone |
|------|-----------|
| 2011 | Founded in Singapore |
| 2012 | Branch office in Yangon, Myanmar |
| 2014 | Branch office in Chengdu, China |
| 2017 | Technology partner with Mercedes-Benz Financial Services |
| 2020 | TISAX certification (Deloitte-audited) |
| 2023 | Great Place To Work — Best Workplace in Technology |
| 2024 | Partnership with Mobagel |
| 2024 | Technology Partnership with Porsche AP |

### Leadership

| Name | Title |
|------|-------|
| Eng Poo Yang | Chief Executive Officer |
| Junie Lek | Chief Revenue Officer |
| Derique Yeo | Design & Product Director |

### Proof Points

Use these in proposals, decks, and marketing materials:
- 200+ bespoke digital applications
- 20+ countries served, 4 continents
- Since 2011 — 14+ years of expertise
- TISAX-certified — independently audited by Deloitte GmbH, aligned with ISO/IEC 27001 and 27002 standards
- Key clients: Porsche, Mercedes-Benz/Daimler, Eurokars, Cycle & Carriage
- Great Place to Work certified (2023, 2024)

---

## Brand Voice & Messaging

Authoritative but not boastful. Innovative but grounded in proof points. Design-conscious. Enterprise-ready. Partner-oriented, not vendor-oriented.

### Tone by Context

| Context | Tone |
|---------|------|
| Website / Marketing | Confident, aspirational, design-forward |
| LinkedIn | Professional, achievement-oriented, community-minded |
| Facebook | Warm, celebratory, community-focused |
| Client Proposals | Precise, solutions-focused, evidence-based |
| Internal Comms | Warm, team-first, celebratory |
| Technical Docs | Clear, structured, jargon-appropriate |

### Terminology

| Always Use | Never Use |
|------------|-----------|
| appvantage> (logo — always as image) / Appvantage (in written text) | AppVantage, App Vantage, APV |
| AI-powered (hyphenated) | AI powered, AI-Powered |
| Design-driven | Design driven |
| Mobile-first | Mobile first |
| Digital solutions | Software products |
| Automotive and Asset Finance | Auto/fintech (in formal contexts) |
| Empower | Help, assist |
| driving sustainable innovation (always lowercase) | Driving Sustainable Innovation (capitalised) |

### Taglines by Context

| Context | Tagline |
|---------|---------|
| Logo / Brand | driving sustainable innovation |
| Site Descriptor | AI-Powered Solutions for Automotive and Asset Finance |
| About Page | Trusted Innovative Automotive Solutions |

### Boilerplate (Long)

Founded in 2011, Appvantage is a design-driven, mobile-first enterprise software company delivering AI-powered digital solutions for the Automotive and Asset Finance industries. With 200+ applications deployed across 20+ countries for clients including Porsche, Mercedes and Cycle & Carriage, Appvantage is the leading digitalisation partner of Singapore's automotive industry. TISAX-certified and audited by Deloitte GmbH, Appvantage empowers enterprises with transformative digital solutions that redefine application design and elevate user experiences.

### Boilerplate (Short)

Appvantage delivers AI-powered digital solutions for Automotive and Asset Finance, with 200+ applications deployed across 20+ countries for clients including Porsche, Mercedes and Cycle & Carriage.

### Copyright

`© [Year] Appvantage. All Rights Reserved.`

TISAX attribution (when required): "TISAX-certified, independently audited by Deloitte GmbH, aligned with ISO/IEC 27001 and 27002 standards."

---

## Products & Enterprise Solutions

### Products (branded, standalone identity)

| Product | Description | Has Own Logo |
|---------|-------------|-------------|
| **AutoRetain** | AI-powered customer retention platform for automotive retail | Yes — 3 variants bundled |

AutoRetain has its own visual identity separate from the Appvantage master brand. Always use the logo image assets — never reconstruct in text or code.

**AutoRetain Logo Assets:**

| File | Description | Usage |
|------|-------------|-------|
| `auto-retain-logo.png` | Full wordmark — "auto" in grey, oversized "R" in Signature Pink with sparkle accents, "etain" in grey. Transparent background. | Marketing materials, decks, landing pages, hero sections, anywhere the full brand name is displayed |
| `retain-admin-logo.png` | Symbol only — the stylised "R" with sparkle accents in Signature Pink. Transparent background. Square aspect ratio. | In-application branding: sidebar logos, app headers, nav bars, dashboard branding, compact spaces where the full wordmark won't fit |
| `retain-fav-icon.png` | Symbol only — the stylised "R" with sparkle accents in Signature Pink. Transparent background. Compact/tight crop. | Browser favicon, app icon, PWA icon, mobile home screen |

**AutoRetain Logo Rules:**
- The full wordmark (`auto-retain-logo.png`) is for external/marketing use — anywhere the product needs to be introduced or identified
- The symbol (`retain-admin-logo.png`) is for in-product use — the user already knows what app they're in, so the "R" mark is sufficient
- The favicon (`retain-fav-icon.png`) is sized and cropped for small renderings — favicons, app icons, notification badges
- All three use Signature Pink (`#E6035F`) for the "R" and sparkle elements — this is AutoRetain's accent colour
- Grey text in the wordmark uses the same grey family as the Appvantage palette
- Never recolour, stretch, rotate, or add effects to any AutoRetain logo variant
- Never reconstruct the "R" symbol in CSS, SVG text, or font glyphs — always use the image asset

### Enterprise Solutions (generic names, not branded products)

These are service/solution offerings — they use the Appvantage brand identity, not their own logos or colour accents:

- **Auto Retail Centre (ARC)** — Digital hub for omni-channel automotive retail
- **ARC Mobility** — Mobility solutions module
- **ARC Car Configurator** — Vehicle configuration tool
- **Trade-In & Bidding/Auction** — Used car valuation and wholesale platform
- **After Sales Management** — End-to-end aftersales with booking, queue, and tracking
- **Central Booking System** — Scheduling and resource-allocation hub
- **AutoSource™** — Talent solutions framework (UI/UX, full-stack, BA, consulting)
- **Business Consulting** — Strategic planning, market analysis, UX studies, service design
- **AI Marketing Agent** — AI-driven ad targeting and campaign optimisation
- **AI Chat Agent** — Conversational AI for web and messaging
- **AI Voice Agent** — Voice-based AI for phone channels

When presenting enterprise solutions in decks or pages, use the product/solution name as a heading under the Appvantage brand. No separate logos required.

---

## Brand Architecture

**Master brand:** appvantage> — the company identity. Always rendered as a logo image asset. Never as text.

**Product brand:** AutoRetain — has its own logo and visual identity. Standalone name (no "Appvantage" prefix required). May have its own accent colour.

**Enterprise solutions:** Generic descriptive names (ARC, AutoSource, AI Chat Agent, etc.) — not branded products. They live under the Appvantage master brand with standard Appvantage visual treatment.

### Rules

1. **The appvantage> logo is ALWAYS an image.** This is the single most important brand rule. Never render it as styled text, HTML spans, SVG text, or any approximation. If the image is unavailable, show nothing.
2. **AutoRetain stands alone.** In product-focused materials, the AutoRetain logo appears independently. The Appvantage logo may appear in the footer or "by Appvantage" attribution, but not merged with the AutoRetain logo.
3. **Enterprise solutions inherit Appvantage branding.** They use Appvantage colours, fonts, and visual system — no separate identity.
4. **Product names do not require an "Appvantage" prefix.** Write "AutoRetain" not "Appvantage AutoRetain". Context makes the relationship clear.

---

## Photography Direction

### Style

- Cinematic cityscapes with dark overlays (Singapore skyline = hero reference)
- Dark, atmospheric compositions with selective warm highlights
- Technology layered over real environments — not abstract tech-only
- Automotive contexts through a digital/design lens
- Warm amber + cyan data particles on dark backgrounds
- Globe/network visualizations with interconnected data points

### Avoid

- Generic stock photography
- Bright flat lighting
- Oversaturated neon
- Abstract tech without real-world grounding
- Low-quality or pixelated images

### Image Treatment

| Context | Treatment |
|---------|-----------|
| Dark mode hero/cover | 40–60% dark overlay, content on left |
| White mode hero/cover | 10–20% white overlay for softer feel |
| Blog / article hero | Full-width, 16:9 aspect ratio, dark cinematic treatment preferred |
| Case study photos | Documentary style, real environments, warm tones |
| Team headshots | Clean background (black or white), consistent lighting, natural expression |
| Social media images | On-brand dark or white backgrounds, no watermark required |

---

## Brand Colours

### Core Palette

| Role | Name | Hex | RGB | Usage |
|------|------|-----|-----|-------|
| Primary Dark | Black | `#000000` | 0, 0, 0 | Dark backgrounds, body text on light |
| Primary Light | White | `#FFFFFF` | 255, 255, 255 | Light backgrounds, text on dark |
| **Brand Accent** | **Signature Pink** | **`#E6035F`** | 230, 3, 95 | CTAs, buttons, highlights, key UI elements |
| Accent Hover | Pink Hover | `#C40250` | 196, 2, 80 | Button/link hover state — never used as default fill |
| Logo Chevron | Chevron Grey | `#a5a9ab` | 165, 169, 171 | Logo chevron only — never recolour or repurpose |
| Tagline / Secondary | Tagline Grey | `#808080` | 128, 128, 128 | Captions, subtitles, tagline text, metadata |
| Card / Panel (Dark) | Card Dark | `#111111` | 17, 17, 17 | Elevated surfaces, panels, cards (dark mode) |
| Card / Panel (White) | Card Light | `#F5F5F5` | 245, 245, 245 | Elevated surfaces, panels, cards (white mode) |
| Body Text (White mode) | Body Dark | `#333333` | 51, 51, 51 | Body text on white backgrounds |
| Structural (Dark) | Border Dark | `#1A1A1A` | 26, 26, 26 | Section separators, table rules (dark mode) |
| Structural (White) | Border Light | `#E8E8E8` | 232, 232, 232 | Borders, dividers (white mode) |
| Footer Text | Footer Grey | `#808080` | 128, 128, 128 | Footer text, timestamps, footnotes (was `#595959` — upgraded for WCAG compliance) |

> **Unauthorised colours:** Deep navy (`#0E2841`) is NOT an Appvantage colour. The PPTX template's built-in colour scheme (teal, orange, green) was a Microsoft Office default — not brand-intentional. Only the colours listed above are part of the Appvantage brand.

Use Signature Pink sparingly — as an accent, not a fill. Never for large backgrounds or body text.

---

## Colour Usage by Context

Each output type has a specific default mode. Apply the right profile for the medium. **Always ask the user** which mode they prefer (see Theme Selection above).

| Context | Default Mode | Background | Headings | Accent (Pink) |
|---------|-------------|-----------|----------|--------|
| Presentations (PPTX) — external | Dark | `#000000` | White `#FFFFFF` | CTAs, stat callouts (max 1–2 per slide) |
| Presentations (PPTX) — internal | White | `#FFFFFF` | Black `#000000` | CTAs only |
| Internal Docs / HTML / Dashboards | White | `#FFFFFF` | Black `#000000` | Interactive elements, links |
| Web Apps | Dark default | `#000000` | White `#FFFFFF` | CTAs, links, section labels, stat numbers |
| Marketing Materials | Dark cinematic | `#000000` | White `#FFFFFF` | CTAs, one stat callout per section |
| Client Proposals | White formal | `#FFFFFF` | Black `#000000` | Max one pink element per full-page spread |

> **Headings are never pink.** In both dark and white modes, headings use the primary text colour (white or black) for maximum legibility. Signature Pink is strictly for accent elements: CTAs, buttons, links, stat callout numbers, and section labels.

---

## Typography

**Font priority (in order):** Acumin Pro → Calibri (for all documents) → Sans Serif (when the above two are unavailable)

| Weight | Usage |
|--------|-------|
| Acumin Pro Light (300) | All brand text — headlines, body, tagline, captions, UI |
| Acumin Pro Bold (700) | Website CTA button labels only (24px) |
| Report SemiBold | Logo wordmark only — always use the logo as an image asset |

**Fallback stack:** `font-family: Calibri, 'Helvetica Neue', Helvetica, Arial, sans-serif;`

Bold weight is for web CTAs only. All documents and presentations use Light.

> Font asset: `fonts.com-Acumin_Pro_Light.otf`

### Web Type Scale (rem-based, scalable)

All web typography uses **rem units** that scale from a single root font-size per breakpoint. This follows best practices from Shopify Polaris (1.2× major third scale), Material Design 3 (15-token system), Framer (rem-based responsive), and WCAG accessibility guidelines.

**Root font-size (set on `<html>`):**

| Breakpoint | Root size | Notes |
|-----------|-----------|-------|
| Desktop (>1024px) | `18px` | Base for all rem calculations |
| Tablet (641–1024px) | `16px` | Scales everything down proportionally |
| Mobile (≤640px) | `16px` | Minimum legible base |

**Type scale tokens:**

| Token | rem | ≈Desktop | ≈Mobile | Weight | Dark Colour | White Colour | Usage |
|-------|-----|----------|---------|--------|------------|-------------|-------|
| Display / Hero | `3.5rem` | 63px | 56px | 300 | White | Black | Hero headlines, landing page titles |
| H1 | `3rem` | 54px | 48px | 300 | White | Black | Page/section titles |
| H2 | `2.25rem` | 40px | 36px | 300 | White | Black | Section headings |
| H3 | `1.75rem` | 32px | 28px | 300 | White | Black | Subsection headings |
| H4 | `1.375rem` | 25px | 22px | 300 | White | Black | Card titles, smaller headings |
| Body Large | `1.125rem` | 20px | 18px | 300 | White / `#333333` | `#333333` | Lead paragraphs, intro text |
| Body | `1rem` | 18px | 16px | 300 | White / `#333333` | `#333333` | Standard body text (line-height 1.5) |
| Body Small | `0.875rem` | 16px | 14px | 300 | White / `#333333` | `#333333` | Secondary body, form labels |
| Caption / Meta | `0.8rem` | 14px | 13px | 300 | `#808080` | `#808080` | Captions, metadata, timestamps |
| Small / Legal | `0.75rem` | 14px | 12px | 300 | `#808080` | `#808080` | Legal text, fine print (minimum size) |
| CTA Button | `1rem` | 18px | 16px | **700** | White on pink pill | White on pink pill | Button labels |

> **Why rem, not px:** rem units respect user browser font-size preferences (accessibility), scale proportionally across breakpoints from a single control point, and prevent the "too small on mobile, too large on desktop" problem. Never use fixed px for text in web output.

**Letter-spacing:** `-0.02em` on all headings. `0.12–0.15em` on ALL-CAPS section labels.
**Line-height:** `1.1` for Display/H1, `1.2` for H2–H4, `1.5` for Body, `1.7` for long-form reading.

### Presentation Type Scale

| Element | Size | Weight | Alignment |
|---------|------|--------|-----------|
| Slide Title | 48pt | 300 | Centre (title slide) / Left (content slides) |
| Subtitle | 32pt | 300 | Centre |
| Body Level 1 | 28pt | 300 | Left |
| Body Level 2 | 24pt | 300 | Left |
| Footer / Date | 14pt | 300 | Left / Right |

Line spacing: 90% for all presentation text. 1.5 for web body. 1.1 for large display text.

---

## Presentation Deck — Template Layout Guide

Reference template: `appvantage_template_v2.1.pptx`

The template contains **2 Slide Masters** and **18 Layouts** — a complete dark set and a complete white set with identical layout structure.

### Slide Masters

| Master | Theme | Background | Layouts | Logo |
|--------|-------|-----------|---------|------|
| **Master 1 — White** | White Design | `#FFFFFF` (scheme bg1) | Layouts 1–9 | `logo25-black.png` (chevron on light bg) |
| **Master 2 — Dark** | Black Design | `#000000` (scheme tx1) | Layouts 10–18 | `logo25-white.png` (chevron on dark bg) |

### Layout Index

| # | Layout Name | Master | Placeholders | Use For |
|---|-------------|--------|-------------|---------|
| **1** | Title Slide (Car) | White | ctrTitle, subTitle + Car bg image | Title/cover — automotive, Retain product |
| **2** | Title Slide (Globe) | White | ctrTitle, subTitle + Globe bg image | Title/cover — sustainability, global reach |
| **3** | Title Slide (Crowd) | White | ctrTitle, subTitle + Crowd bg image | Title/cover — enterprise, market, people |
| **4** | Title Slide (Highway) | White | ctrTitle, subTitle + Highway bg image | Title/cover — infrastructure, scale |
| **5** | Title and Content | White | title, body, dt, ftr, sldNum | Standard content slide |
| **6** | Two Content | White | title, 2× body (left + right), dt, ftr, sldNum | Split content, comparison |
| **7** | Comparison | White | title, 2× label + 2× body, dt, ftr, sldNum | Side-by-side comparison with headers |
| **8** | Title Only | White | title, dt, ftr, sldNum | Free-form slide with title |
| **9** | Blank | White | dt, ftr, sldNum only | Full custom slide |
| **10** | Title Slide (Car) | Dark | ctrTitle, subTitle + Car bg image | Title/cover — automotive, Retain product |
| **11** | Title Slide (Globe) | Dark | ctrTitle, subTitle + Globe bg image | Title/cover — sustainability, global reach |
| **12** | Title Slide (Crowd) | Dark | ctrTitle, subTitle + Crowd bg image | Title/cover — enterprise, market, people |
| **13** | Title Slide (Highway) | Dark | ctrTitle, subTitle + Highway bg image | Title/cover — infrastructure, scale |
| **14** | Title and Content | Dark | title, body, dt, ftr, sldNum | Standard content slide |
| **15** | Two Content | Dark | title, 2× body (left + right), dt, ftr, sldNum | Split content, comparison |
| **16** | Comparison | Dark | title, 2× label + 2× body, dt, ftr, sldNum | Side-by-side comparison with headers |
| **17** | Title Only | Dark | title, dt, ftr, sldNum | Free-form slide with title |
| **18** | Blank | Dark | dt, ftr, sldNum only | Full custom slide |

### Layout Selection Guide

| Slide Purpose | White Layout | Dark Layout |
|---------------|-------------|-------------|
| Cover / Title — automotive | Layout 1 | Layout 10 |
| Cover / Title — sustainability | Layout 2 | Layout 11 |
| Cover / Title — enterprise/people | Layout 3 | Layout 12 |
| Cover / Title — infrastructure | Layout 4 | Layout 13 |
| Standard content (text + bullets) | Layout 5 | Layout 14 |
| Two-column content | Layout 6 | Layout 15 |
| Side-by-side comparison | Layout 7 | Layout 16 |
| Title + free-form content | Layout 8 | Layout 17 |
| Full custom (no title) | Layout 9 | Layout 18 |

### Placeholder Positions (inherited from masters)

| Placeholder | Position | Size | Notes |
|-------------|----------|------|-------|
| Title | (0.92", 0.40") | 11.50" × 1.45" | Left-aligned on content slides, centred on title slides |
| Body | (0.92", 2.00") | 11.50" × 4.76" | Content area below title |
| Two Content (left) | (0.92", 2.00") | 5.67" × 4.76" | Left half of slide |
| Two Content (right) | (6.75", 2.00") | 5.67" × 4.76" | Right half of slide |
| Date | (0.92", 6.95") | 3.00" × 0.40" | Bottom-left |
| Footer | (4.42", 6.95") | 4.50" × 0.40" | Bottom-centre |
| Slide Number | (9.42", 6.95") | 3.00" × 0.40" | Bottom-right |

### Footer Format

All content slides (not title slides) include a standard footer bar:

| Field | Position | Format | Example |
|-------|----------|--------|---------|
| Date | Bottom-left | `DD-MMM-YY` | `12-Mar-26` |
| Footer | Bottom-centre | Copyright text | `© 2026 Appvantage. All Rights Reserved` |
| Slide Number | Bottom-right | Page number | `3` |

**Year in copyright:** Always use the current year. Format: `© {YYYY} Appvantage. All Rights Reserved`

### Programmatic PPTX Notes

- The template's theme XML defaults to "Aptos Display" — this is a Microsoft default, **not** an Appvantage font. When creating slides programmatically (python-pptx, pptxgenjs), **always explicitly set fonts** to Calibri (or Acumin Pro if available) on every text frame. Do not rely on the theme font.
- Title slides (Layouts 1–4, 10–13) have background images embedded in the layout. When using the template, simply apply the correct layout index and the background loads automatically.
- Content slides (Layouts 5–9, 14–18) inherit the master background colour (white or black). No image overlay needed.

---

## Slide Background Images

Four themed background compositions are available, each in both dark and white variants. These are embedded in the title slide layouts of the PPTX template.

| Theme | White Layout | Dark Layout | Visual | Best Used For |
|-------|-------------|-------------|--------|---------------|
| **Car** | Layout 1 | Layout 10 | Sports car in motion framed within chevron | Automotive, Retain product, mobility |
| **Globe** | Layout 2 | Layout 11 | Tech globe with emerging elements | Sustainability, innovation, global reach, ESG |
| **Crowd** | Layout 3 | Layout 12 | Silhouetted crowd in motion | Enterprise, customers, people, market |
| **Highway** | Layout 4 | Layout 13 | City highway with light trails | Infrastructure, scale, logistics, reach |

**Dark variants:** Full-colour photography on black background with chevron composition. Content on left, visual on right.

**White variants:** Same compositions with white/light tint overlay. Lighter treatment, softer contrast — still with chevron framing.

**Critical rule — Chevron Usage (all output types):**
> **NEVER render the chevron as a text character (`">"`) or CSS pseudo-element (`content: ">"`) in any context — HTML, React, or PPTX.** The `">"` character in any font renders too thin and never matches the brand asset. For PPTX: use the template layouts which embed the chevron backgrounds. For web: use `background-plain.png` as a `background-image`. This is an absolute rule with no exceptions.

**Usage rules:**
- For PPTX: apply the correct title slide layout from the template — the background image is built-in
- For web: set as background image, stretched to fill (1920×1080 or equivalent aspect ratio)
- Text and content always sit on the left side — never place primary content over the right-side imagery
- Do not crop, recolour, or apply filters to these backgrounds
- Photography backgrounds are for title/cover slides — don't use them for every slide in a deck

---

## Programmatic Font Application (Code Generation)

When generating code (Python/pptxgenjs/CSS) that applies brand fonts:

- **Headings (≥24pt / ≥32px):** Apply Acumin Pro Light first; fall back to Calibri
- **Body text (<24pt / <32px):** Apply Acumin Pro Light first; fall back to Calibri
- **Both tiers use the same font family** — the distinction is size, not font weight
- Never apply Bold programmatically except for web CTA buttons
- Always provide the full fallback stack: `Calibri, 'Helvetica Neue', Helvetica, Arial, sans-serif`

### Shape & Decorative Element Colors

When programmatically styling non-text shapes (dividers, accent bars, backgrounds, decorative elements):

**Dark context (PPTX dark, marketing):**
- `#000000` as base fill
- `#E6035F` for single accent shapes per slide
- `#a5a9ab` for subtle secondary shapes (e.g. divider lines)

**White context (PPTX white, docs, proposals):**
- `#FFFFFF` as base fill
- `#E8E8E8` for borders/dividers
- `#E6035F` for CTA elements only
- `#F5F5F5` for card/panel backgrounds

Never cycle through multiple accent colours — Appvantage is a single-accent brand (Signature Pink only).

### RGBColor Values for python-pptx

```python
# ── Core palette ──
BLACK       = RGBColor(0,   0,   0)
WHITE       = RGBColor(255, 255, 255)
SIG_PINK    = RGBColor(230, 3,   95)
PINK_HOVER  = RGBColor(196, 2,   80)
CHEV_GREY   = RGBColor(165, 169, 171)
TAG_GREY    = RGBColor(128, 128, 128)
FOOTER_GREY = RGBColor(128, 128, 128)  # Was MUTED_GREY #595959 — upgraded for legibility

# ── Dark mode surfaces ──
CARD_DARK   = RGBColor(17,  17,  17)
BORDER_DARK = RGBColor(26,  26,  26)

# ── White mode surfaces ──
CARD_LIGHT  = RGBColor(245, 245, 245)
BORDER_LIGHT= RGBColor(232, 232, 232)
BODY_DARK   = RGBColor(51,  51,  51)
```

---

## Frontend Design Execution (Web & React Artifacts)

When building HTML pages, React components, dashboards, or any rendered web output for Appvantage, apply brand tokens AND design craft. Being on-brand is the floor — being *memorable* is the goal.

### Design Thinking Before Coding

Before writing a single line, answer these:
- **Purpose:** What problem does this interface solve? Who uses it?
- **Differentiator:** What is the one thing a user will remember about this screen?
- **Mode:** Dark or white? (Ask the user if not specified.)
- **Tone:** Within the chosen mode, pick a flavour — e.g. *data-dense precision*, *editorial magazine*, *luxury minimal*, *kinetic/motion-forward*. The brand constrains colours and fonts; it does not constrain spatial drama or motion.

Execute with full commitment to the chosen direction.

### Motion & Animation

- **Page load:** One well-orchestrated staggered reveal (using `animation-delay`) creates more delight than scattered micro-interactions.
- **Scroll triggers:** Fade/translate elements into view as the user scrolls — subtle, not jarring.
- **Hover states:** Surprise the user — scale, underline slides in from left, colour bleeds, icon rotates. Avoid generic `opacity: 0.8` hover.
- **Signature Pink transitions:** When pink appears on hover/active, use a `transition: color 200ms ease` — never an instant snap.
- **Prefer CSS-only** for HTML artifacts. Use the Motion library for React when available.

### Spatial Composition

Avoid predictable grid-centre layouts. Consider:
- **Asymmetry** — not everything needs to be centred or evenly split
- **Overlap** — cards, text, and images that break their container boundaries
- **Generous negative space** — restraint reads as confidence (especially on dark)
- **Grid-breaking elements** — a single oversized number, icon, or heading that bleeds past its column
- **Left-heavy composition** — consistent with the slide background convention (content left, visual right)

### Background & Atmosphere

**Dark mode:** Black (`#000000`) is the base, but atmosphere comes from layering:
- **Subtle grain overlay** — `noise` SVG filter or CSS grain at 3–5% opacity over solid black
- **Dark card gradients** — `linear-gradient(135deg, #111111, #0a0a0a)` for panels
- **Radial glow** — very dark radial gradient in Signature Pink at 2–4% opacity behind hero CTA
- **Layered transparencies** — stack semi-transparent cards (`rgba(255,255,255,0.03)`) for depth

**White mode:** White (`#FFFFFF`) is the base, with a different set of atmosphere techniques:
- **Subtle warm grey cards** — `#F5F5F5` panels on `#FFFFFF` background for layered depth
- **Light border definition** — `1px solid #E8E8E8` on cards and sections to define edges
- **Signature Pink as punctuation** — a thin accent line, a small dot, a CTA button — never dominant
- **Shadow sparingly** — `box-shadow: 0 1px 3px rgba(0,0,0,0.08)` for subtle card elevation
- **No heavy gradients** — the white theme is clean and flat. Depth comes from borders and elevation, not colour gradients.

### Typography as Design Element

The font stack is fixed (Acumin Pro / Calibri). Within that constraint:
- Use **scale contrast dramatically** — a 96px display figure next to 14px captions creates editorial tension
- Use **weight contrast** — 300 body against 700 CTA button is the only sanctioned contrast
- **Letter-spacing** on uppercase labels: `letter-spacing: 0.15em` on all-caps section labels
- **Line-height discipline** — 1.1 for large display text, 1.5 for body, 1.7 for long-form reading

### Anti-Patterns to Avoid

Beyond the brand "What NOT to Do" list:
- ❌ Generic card grid with equal padding everywhere — vary density intentionally
- ❌ Centred hero with centred CTA — left-aligned or asymmetric composition is more distinctive
- ❌ Equal visual weight on every element — establish a clear hierarchy per section
- ❌ Animation on every element — animate what matters, leave the rest still
- ❌ Flat information architecture — use depth (layered cards, modals, drawers) for spatial sense

---

## Iconography

- Line-style icons (1.5–2px stroke), not filled/solid
- **Dark mode:** White on dark backgrounds
- **White mode:** Black (`#333333`) on light backgrounds
- Signature Pink for CTAs or interactive states (both modes)
- Consistent rounded corners (2px radius)
- Recommended library: [Lucide Icons](https://lucide.dev/)

---

## Data Visualisation

When building charts, graphs, or data dashboards for Appvantage, follow these rules to ensure brand consistency.

### Chart Colour Sequence

Use this ordered palette for data series. Signature Pink is always the primary/first series:

| Series | Hex | Name | Usage |
|--------|-----|------|-------|
| 1 (Primary) | `#E6035F` | Signature Pink | First/most important data series |
| 2 | `#a5a9ab` | Chevron Grey | Second series |
| 3 | `#808080` | Tagline Grey | Third series |
| 4 | `#FFFFFF` (dark) / `#333333` (white) | Text colour | Fourth series |
| 5 | `#C40250` | Pink Hover | Fifth series (darker pink variant) |
| 6 | `#595959` | Muted Grey | Sixth series |

> **Never introduce blues, teals, greens, or oranges** into Appvantage charts. The brand is monochromatic with a single pink accent. If more than 6 series are needed, use opacity variants of the above (e.g. `rgba(230,3,95,0.5)`).

### Axis & Grid Styling

**Dark mode:**

| Element | Style |
|---------|-------|
| Axis lines | `#1A1A1A` or hidden |
| Axis labels | `#808080`, 12px, weight 300 |
| Grid lines | `#1A1A1A`, 1px, dashed or dotted |
| Tick marks | Hidden (clean look) |
| Chart background | `transparent` (inherits `#000000` or `#111111` card) |

**White mode:**

| Element | Style |
|---------|-------|
| Axis lines | `#E8E8E8` or hidden |
| Axis labels | `#808080`, 12px, weight 300 |
| Grid lines | `#E8E8E8`, 1px, dashed or dotted |
| Tick marks | Hidden |
| Chart background | `transparent` (inherits `#FFFFFF` or `#F5F5F5` card) |

### Tooltip Styling

**Dark mode:** Background `#111111`, border `1px solid #1A1A1A`, text `#FFFFFF`, accent value in `#E6035F`.
**White mode:** Background `#FFFFFF`, border `1px solid #E8E8E8`, shadow `0 2px 8px rgba(0,0,0,0.1)`, text `#333333`, accent value in `#E6035F`.

### Chart Type Guidance

- **Bar/Column charts:** Use solid fills from the sequence. No gradients.
- **Line charts:** 2px stroke weight, smooth curves. Active line in `#E6035F`.
- **Pie/Donut:** Maximum 4–5 segments. Use the colour sequence. Label outside the chart.
- **Area charts:** Use 10–20% opacity fills under the lines.
- **KPI cards / Big numbers:** Display the number in `#E6035F` at 48–56px, label below in `#808080` at 14px.

### Recharts / Chart.js Configuration

```jsx
// Recharts — Dark mode
const CHART_COLORS_DARK = ['#E6035F', '#a5a9ab', '#808080', '#FFFFFF', '#C40250', '#595959'];
const AXIS_STYLE_DARK = { fontSize: 12, fill: '#808080', fontFamily: "'Acumin Pro', Calibri, sans-serif", fontWeight: 300 };
const GRID_STYLE_DARK = { stroke: '#1A1A1A', strokeDasharray: '3 3' };

// Recharts — White mode
const CHART_COLORS_WHITE = ['#E6035F', '#a5a9ab', '#808080', '#333333', '#C40250', '#595959'];
const AXIS_STYLE_WHITE = { fontSize: 12, fill: '#808080', fontFamily: "'Acumin Pro', Calibri, sans-serif", fontWeight: 300 };
const GRID_STYLE_WHITE = { stroke: '#E8E8E8', strokeDasharray: '3 3' };
```

---

## Email Signature

Template: `email-signature-2.html`

| Field | Format |
|-------|--------|
| Name | Full name — Calibri, slightly larger, black |
| Job Title | Calibri, Tagline Grey (`#808080`) |
| Website | appvantage.co |
| Phone | Direct or mobile with country code |
| Address | 114 Lavender Street, #07-86, CT Hub 2, Singapore 338729 |

Rules: No promotional banners or quotes. No social media icons unless approved. Font: Calibri stack. Clean and minimal. Signature Pink may be used for name only as a subtle accent.

---

## Web Design Patterns

Built on **Framer** (outstanding-conference-741243.framer.app). Custom domain: appvantage.co. Dark-dominant, responsive.

### Responsive Breakpoints

| Breakpoint | Width | Notes |
|-----------|-------|-------|
| Mobile | `< 640px` | Single column, stacked layout, hamburger nav |
| Tablet | `640px – 1024px` | Two columns where appropriate, collapsible sidebar |
| Desktop | `> 1024px` | Full layout, multi-column grids |
| Wide | `> 1440px` | Max-width container `1200px`, centred |

```css
@media (max-width: 640px) { /* mobile rules */ }
@media (min-width: 641px) and (max-width: 1024px) { /* tablet rules */ }
@media (min-width: 1025px) { /* desktop rules */ }
```

**Mobile navigation:** Hamburger icon (Lucide `Menu`), full-screen overlay or slide-in drawer on black (`#000000`) background. Close with Lucide `X` icon.

---

## CSS Tokens & Layout Principles

### CSS Custom Properties — Dark Mode

```css
html { font-size: 18px; } /* Desktop root — all rem values scale from this */
@media (max-width: 1024px) { html { font-size: 16px; } } /* Tablet + Mobile */

:root {
  /* ── Dark mode (default) ── */
  --bg-primary:    #000000;
  --bg-card:       #111111;
  --bg-nav:        #000000;
  --text-primary:  #FFFFFF;
  --text-body:     #FFFFFF;
  --text-heading:  #FFFFFF;  /* All headings are white — never pink */
  --text-secondary:#808080;
  --text-footer:   #808080;  /* Upgraded from #595959 for WCAG compliance (5.32:1) */
  --accent:        #E6035F;  /* CTAs, links, stat numbers, section labels ONLY */
  --accent-hover:  #C40250;
  --border:        #1A1A1A;
  --chevron-grey:  #a5a9ab;
  --font-stack: 'Acumin Pro', Calibri, 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --fw-default: 300;
  --fw-cta: 700;

  /* ── Type scale (rem) ── */
  --text-display:  3.5rem;   /* 63px desktop / 56px mobile */
  --text-h1:       3rem;     /* 54px / 48px */
  --text-h2:       2.25rem;  /* 40px / 36px */
  --text-h3:       1.75rem;  /* 32px / 28px */
  --text-h4:       1.375rem; /* 25px / 22px */
  --text-body-lg:  1.125rem; /* 20px / 18px */
  --text-body:     1rem;     /* 18px / 16px */
  --text-body-sm:  0.875rem; /* 16px / 14px */
  --text-caption:  0.8rem;   /* 14px / 13px */
  --text-small:    0.75rem;  /* 14px / 12px — minimum */

  /* ── Spacing ── */
  --space-xs: 0.25rem; --space-sm: 0.5rem;  --space-md: 1rem;
  --space-lg: 1.5rem;  --space-xl: 2.5rem;  --space-2xl: 4rem;
  --radius-sm: 4px; --radius-md: 8px;  --radius-pill: 999px;
}
```

### CSS Custom Properties — White Mode

```css
html { font-size: 18px; }
@media (max-width: 1024px) { html { font-size: 16px; } }

:root {
  /* ── White mode ── */
  --bg-primary:    #FFFFFF;
  --bg-card:       #F5F5F5;
  --bg-nav:        #FFFFFF;
  --text-primary:  #000000;
  --text-body:     #333333;
  --text-heading:  #000000;  /* All headings are black */
  --text-secondary:#808080;
  --text-footer:   #808080;
  --accent:        #E6035F;  /* CTAs, links, stat numbers, section labels ONLY */
  --accent-hover:  #C40250;
  --border:        #E8E8E8;
  --chevron-grey:  #a5a9ab;
  --font-stack: 'Acumin Pro', Calibri, 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --fw-default: 300;
  --fw-cta: 700;

  /* ── Type scale (same rem values — root size handles scaling) ── */
  --text-display:  3.5rem;
  --text-h1:       3rem;
  --text-h2:       2.25rem;
  --text-h3:       1.75rem;
  --text-h4:       1.375rem;
  --text-body-lg:  1.125rem;
  --text-body:     1rem;
  --text-body-sm:  0.875rem;
  --text-caption:  0.8rem;
  --text-small:    0.75rem;

  /* ── Spacing ── */
  --space-xs: 0.25rem; --space-sm: 0.5rem;  --space-md: 1rem;
  --space-lg: 1.5rem;  --space-xl: 2.5rem;  --space-2xl: 4rem;
  --radius-sm: 4px; --radius-md: 8px;  --radius-pill: 999px;
}
```

### React Theme Constants

```jsx
// ── Type scale tokens (rem) ──
const typeScale = {
  display: '3.5rem',  // 63px desktop / 56px mobile
  h1: '3rem',         // 54px / 48px
  h2: '2.25rem',      // 40px / 36px
  h3: '1.75rem',      // 32px / 28px
  h4: '1.375rem',     // 25px / 22px
  bodyLg: '1.125rem', // 20px / 18px
  body: '1rem',       // 18px / 16px — base
  bodySm: '0.875rem', // 16px / 14px
  caption: '0.8rem',  // 14px / 13px
  small: '0.75rem',   // 14px / 12px — minimum
};

// ── Dark theme ──
const themeDark = {
  colors: {
    bg: '#000000', bgCard: '#111111', bgNav: '#000000',
    text: '#FFFFFF', textBody: '#FFFFFF',
    textHeading: '#FFFFFF',  // All headings are white — never pink
    textSecondary: '#808080', textFooter: '#808080',
    accent: '#E6035F', accentHover: '#C40250',  // Accent for CTAs, links, stats ONLY
    border: '#1A1A1A', chevronGrey: '#a5a9ab',
  },
  font: "'Acumin Pro', Calibri, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  fw: 300, fwCTA: 700,
  type: typeScale,
};

// ── White theme ──
const themeWhite = {
  colors: {
    bg: '#FFFFFF', bgCard: '#F5F5F5', bgNav: '#FFFFFF',
    text: '#000000', textBody: '#333333',
    textHeading: '#000000',  // All headings are black
    textSecondary: '#808080', textFooter: '#808080',
    accent: '#E6035F', accentHover: '#C40250',
    border: '#E8E8E8', chevronGrey: '#a5a9ab',
  },
  font: "'Acumin Pro', Calibri, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  fw: 300, fwCTA: 700,
  type: typeScale,
};

// Usage: const theme = userPreference === 'white' ? themeWhite : themeDark;
```

### Layout Principles

1. **Ask the user first.** Dark or white? Apply the correct token set. Never mix modes within a single artifact.
2. **Logo placement.** Top-left in nav or page header. Use `logo25-white.png` on dark, `logo25-black.png` on white. Always as `<img>` — never text-rendered.
3. **Signature Pink is surgical.** Max 1–2 pink elements per visible section or slide. Never as background fill. Never for headings (headings are always white on dark, black on white). Pink is for: CTAs, buttons, links, stat callout numbers, section labels, and interactive states only.
4. **Icons: Lucide, line-style only.** Stroke 1.5–2px. White on dark; black/dark grey on white; pink for interactive/CTA states.
5. **Chevron background motif — graphic asset only, no exceptions.** Use `background-plain.png` as CSS `background-image` or `<img>`. Never approximate with characters or code.
6. **Photography.** Dark mode: overlay ≥40% opacity. White mode: use as-is or with 10–20% white overlay for softer feel.
7. **Favicon is mandatory.** Every Appvantage HTML page MUST include a favicon using `logosymbol.png` (base64-encoded). Read the file from `/mnt/skills/user/appvantage-brand/logosymbol.png`, base64-encode it, and embed as `<link rel="icon" type="image/png" href="data:image/png;base64,...">`. This applies to all HTML output — pages, artifacts, dashboards, reports. For AutoRetain pages, use `retain-fav-icon.png` instead. No exceptions — a missing favicon is a brand violation.

### Tailwind Class Mapping

| Brand Token | Dark Tailwind | White Tailwind |
|-------------|--------------|----------------|
| Background | `bg-black` | `bg-white` |
| Card | `bg-neutral-900` | `bg-neutral-100` |
| Text primary | `text-white` | `text-black` |
| Text body | `text-white` | `text-neutral-700` |
| Text secondary | `text-neutral-500` | `text-neutral-500` |
| Border | `border-neutral-900` | `border-neutral-200` |
| Accent | *(hex inline or extend: `'av-pink': '#E6035F'`)* | Same |
| Font weight 300 | `font-light` | `font-light` |
| Font weight 700 | `font-bold` | `font-bold` |
| Border radius pill | `rounded-full` | `rounded-full` |
| Border radius md | `rounded-lg` | `rounded-lg` |

---

## Component Patterns

### HTML Boilerplate — Dark Mode

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Appvantage — [Page Title]</title>
  <!-- MANDATORY: Appvantage favicon — base64-encode logosymbol.png and embed here -->
  <link rel="icon" type="image/png" href="data:image/png;base64,..." />
  <link rel="apple-touch-icon" href="data:image/png;base64,..." />
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
  <style>
    /* === PASTE :root DARK block here (includes html font-size + type scale tokens) === */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg-primary); color: var(--text-body); font-family: var(--font-stack); font-weight: 300; font-size: var(--text-body); line-height: 1.5; -webkit-font-smoothing: antialiased; }
    h1, h2, h3, h4, h5, h6 { font-weight: 300; letter-spacing: -0.02em; color: var(--text-heading); }
    h1 { font-size: var(--text-h1); line-height: 1.1; }
    h2 { font-size: var(--text-h2); line-height: 1.2; }
    h3 { font-size: var(--text-h3); line-height: 1.2; }
    h4 { font-size: var(--text-h4); line-height: 1.3; }
    p  { color: var(--text-body); line-height: 1.5; font-size: var(--text-body); }
    a  { color: var(--accent); text-decoration: none; transition: color 0.2s ease; }
    a:hover { color: var(--accent-hover); }
    hr { border: none; border-top: 1px solid var(--border); margin: var(--space-xl) 0; }

    nav { position: fixed; top: 0; left: 0; right: 0; height: 64px; background: var(--bg-nav); display: flex; align-items: center; justify-content: space-between; padding: 0 var(--space-xl); border-bottom: 1px solid var(--border); z-index: 100; }
    .nav-logo img { height: 28px; width: auto; display: block; }
    .nav-links { display: flex; gap: var(--space-xl); list-style: none; }
    .nav-links a { color: var(--text-primary); font-size: var(--text-body-sm); font-weight: 300; }
    .nav-links a:hover { color: var(--accent); }
    .nav-cta { background: var(--accent); color: #fff; font-weight: 700; font-size: var(--text-body-sm); padding: 0.5rem 1.25rem; border-radius: var(--radius-pill); border: none; cursor: pointer; transition: background 0.2s ease; display: inline-flex; align-items: center; justify-content: center; line-height: 1; text-decoration: none; }
    .nav-cta:hover { background: var(--accent-hover); }
    main { padding-top: 64px; }

    .hero {
      min-height: 80vh; display: flex; flex-direction: column; justify-content: center;
      padding: var(--space-2xl) var(--space-xl); position: relative; overflow: hidden;
      background-image: url('background-plain.png');
      background-size: cover; background-position: center right; background-repeat: no-repeat;
    }
    .eyebrow { color: var(--text-secondary); font-size: var(--text-caption); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: var(--space-md); }

    .btn-primary { background: var(--accent); color: #fff; font-family: var(--font-stack); font-weight: 700; font-size: var(--text-body); padding: 0.8rem 2rem; border-radius: var(--radius-pill); border: none; cursor: pointer; transition: background 0.2s ease; display: inline-flex; align-items: center; justify-content: center; line-height: 1; text-decoration: none; }
    .btn-primary:hover { background: var(--accent-hover); }
    .btn-secondary { background: transparent; color: var(--text-primary); font-family: var(--font-stack); font-weight: 300; font-size: var(--text-body); padding: 0.8rem 2rem; border-radius: var(--radius-pill); border: 1px solid var(--text-primary); cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; justify-content: center; line-height: 1; text-decoration: none; }
    .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }

    /* ── Cards — strict alignment rules ── */
    .card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-lg); display: flex; flex-direction: column; }
    .card-callout { background: var(--bg-card); border-left: 4px solid var(--accent); border-radius: var(--radius-md); padding: var(--space-lg); display: flex; flex-direction: column; }
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--space-md);
      align-items: stretch; /* All cards same height per row */
    }
    /* Card internal alignment — consistent spacing between child elements */
    .card > *:not(:last-child),
    .card-callout > *:not(:last-child) { margin-bottom: var(--space-sm); }
    .card > *:last-child { margin-top: auto; } /* Push last element (CTA/link) to bottom */

    .section { padding: var(--space-2xl) var(--space-xl); max-width: 1200px; margin: 0 auto; }
    .section-label { color: var(--accent); font-size: var(--text-caption); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: var(--space-md); }
    .stat-value { font-size: var(--text-display); font-weight: 300; color: var(--accent); line-height: 1; }
    .stat-label { font-size: var(--text-caption); color: var(--text-secondary); margin-top: var(--space-xs); }

    footer { background: var(--bg-primary); border-top: 1px solid var(--border); padding: var(--space-xl); color: var(--text-footer); font-size: var(--text-small); }

    /* Responsive */
    @media (max-width: 640px) {
      .hero { min-height: 60vh; padding: var(--space-xl) var(--space-md); }
      .nav-links { display: none; }
      .section { padding: var(--space-xl) var(--space-md); }
      .card-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <nav>
    <div class="nav-logo"><img src="logo25-white.png" alt="appvantage"></div>
    <ul class="nav-links">
      <li><a href="#">Home</a></li><li><a href="#">Products</a></li><li><a href="#">About</a></li>
    </ul>
    <button class="nav-cta">Contact Us</button>
  </nav>
  <main>
    <section class="hero">
      <p class="eyebrow">AI-Powered Solutions</p>
      <h1>driving sustainable innovation</h1>
      <p style="max-width:560px; color:var(--text-secondary); font-size:var(--text-body-lg); margin-bottom:var(--space-xl);">Your value proposition here.</p>
      <div style="display:flex; gap:var(--space-md); flex-wrap:wrap;">
        <a href="#" class="btn-primary">Get Started</a>
        <a href="#" class="btn-secondary">Learn More</a>
      </div>
    </section>
    <div class="section"><!-- content --></div>
  </main>
  <footer>
    <div style="max-width:1200px; margin:0 auto; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--space-md);">
      <img src="logo25-white.png" alt="appvantage" style="height:20px; width:auto;">
      <p>© 2025 Appvantage Pte Ltd · driving sustainable innovation · Singapore</p>
    </div>
  </footer>
  <script>lucide.createIcons();</script>
</body>
</html>
```

### HTML Boilerplate — White Mode

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Appvantage — [Page Title]</title>
  <!-- MANDATORY: Appvantage favicon — base64-encode logosymbol.png and embed here -->
  <link rel="icon" type="image/png" href="data:image/png;base64,..." />
  <link rel="apple-touch-icon" href="data:image/png;base64,..." />
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
  <style>
    /* === PASTE :root WHITE block here (includes html font-size + type scale tokens) === */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg-primary); color: var(--text-body); font-family: var(--font-stack); font-weight: 300; font-size: var(--text-body); line-height: 1.5; -webkit-font-smoothing: antialiased; }
    h1, h2, h3, h4, h5, h6 { font-weight: 300; letter-spacing: -0.02em; color: var(--text-heading); }
    h1 { font-size: var(--text-h1); line-height: 1.1; }
    h2 { font-size: var(--text-h2); line-height: 1.2; }
    h3 { font-size: var(--text-h3); line-height: 1.2; }
    h4 { font-size: var(--text-h4); line-height: 1.3; }
    p  { color: var(--text-body); line-height: 1.5; font-size: var(--text-body); }
    a  { color: var(--accent); text-decoration: none; transition: color 0.2s ease; }
    a:hover { color: var(--accent-hover); }
    hr { border: none; border-top: 1px solid var(--border); margin: var(--space-xl) 0; }

    nav { position: fixed; top: 0; left: 0; right: 0; height: 64px; background: var(--bg-nav); display: flex; align-items: center; justify-content: space-between; padding: 0 var(--space-xl); border-bottom: 1px solid var(--border); z-index: 100; }
    .nav-logo img { height: 28px; width: auto; display: block; }
    .nav-links { display: flex; gap: var(--space-xl); list-style: none; }
    .nav-links a { color: var(--text-primary); font-size: var(--text-body-sm); font-weight: 300; }
    .nav-links a:hover { color: var(--accent); }
    .nav-cta { background: var(--accent); color: #fff; font-weight: 700; font-size: var(--text-body-sm); padding: 0.5rem 1.25rem; border-radius: var(--radius-pill); border: none; cursor: pointer; transition: background 0.2s ease; display: inline-flex; align-items: center; justify-content: center; line-height: 1; text-decoration: none; }
    .nav-cta:hover { background: var(--accent-hover); }
    main { padding-top: 64px; }

    .btn-primary { background: var(--accent); color: #fff; font-family: var(--font-stack); font-weight: 700; font-size: var(--text-body); padding: 0.8rem 2rem; border-radius: var(--radius-pill); border: none; cursor: pointer; transition: background 0.2s ease; display: inline-flex; align-items: center; justify-content: center; line-height: 1; text-decoration: none; }
    .btn-primary:hover { background: var(--accent-hover); }
    .btn-secondary { background: transparent; color: var(--text-primary); font-family: var(--font-stack); font-weight: 300; font-size: var(--text-body); padding: 0.8rem 2rem; border-radius: var(--radius-pill); border: 1px solid var(--border); cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; justify-content: center; line-height: 1; text-decoration: none; }
    .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }

    /* ── Cards — strict alignment rules ── */
    .card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-lg); display: flex; flex-direction: column; }
    .card-callout { background: var(--bg-card); border-left: 4px solid var(--accent); border-radius: var(--radius-md); padding: var(--space-lg); display: flex; flex-direction: column; }
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--space-md);
      align-items: stretch;
    }
    .card > *:not(:last-child),
    .card-callout > *:not(:last-child) { margin-bottom: var(--space-sm); }
    .card > *:last-child { margin-top: auto; }

    .section { padding: var(--space-2xl) var(--space-xl); max-width: 1200px; margin: 0 auto; }
    .section-label { color: var(--accent); font-size: var(--text-caption); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: var(--space-md); }
    .stat-value { font-size: var(--text-display); font-weight: 300; color: var(--accent); line-height: 1; }
    .stat-label { font-size: var(--text-caption); color: var(--text-secondary); margin-top: var(--space-xs); }

    footer { background: var(--bg-card); border-top: 1px solid var(--border); padding: var(--space-xl); color: var(--text-footer); font-size: var(--text-small); }

    @media (max-width: 640px) {
      .nav-links { display: none; }
      .section { padding: var(--space-xl) var(--space-md); }
      .card-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <nav>
    <div class="nav-logo"><img src="logo25-black.png" alt="appvantage"></div>
    <ul class="nav-links">
      <li><a href="#">Home</a></li><li><a href="#">Products</a></li><li><a href="#">About</a></li>
    </ul>
    <button class="nav-cta">Contact Us</button>
  </nav>
  <main>
    <div class="section"><!-- content --></div>
  </main>
  <footer>
    <div style="max-width:1200px; margin:0 auto; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--space-md);">
      <img src="logo25-black.png" alt="appvantage" style="height:20px; width:auto;">
      <p>© 2025 Appvantage Pte Ltd · driving sustainable innovation · Singapore</p>
    </div>
  </footer>
  <script>lucide.createIcons();</script>
</body>
</html>
```

### React Component Patterns

```jsx
// ── Theme selection helper ──
const useAppvantageTheme = (mode = 'dark') => mode === 'white' ? themeWhite : themeDark;

// ── Base wrapper — adapts to mode ──
function AppvantageLayout({ mode = 'dark', children }) {
  const theme = useAppvantageTheme(mode);
  return (
    <div style={{ background: theme.colors.bg, color: theme.colors.textBody, fontFamily: theme.font, fontWeight: 300, minHeight: '100vh' }}>
      {children}
    </div>
  );
}

// ── Logo — selects correct asset based on mode ──
// For artifacts / sandboxed environments, use hosted URLs.
// For file-based outputs, use relative filenames.
const LOGO_URLS = {
  dark: 'https://appvantage.co/assets/logo25-white.png',   // white logo on dark bg
  white: 'https://appvantage.co/assets/logo25-black.png',  // black logo on white bg
};
const LOGO_FILES = { dark: 'logo25-white.png', white: 'logo25-black.png' };

function Logo({ mode = 'dark', height = '28px', artifact = true }) {
  const src = artifact ? LOGO_URLS[mode] : LOGO_FILES[mode];
  return <img src={src} alt="appvantage" style={{ height, width: 'auto', display: 'block' }} />;
}

// ── Primary Button (same for both modes — pink pill, white text) ──
function PrimaryButton({ children, onClick }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? '#C40250' : '#E6035F', color: '#fff', fontFamily: "'Acumin Pro', Calibri, sans-serif", fontWeight: 700, fontSize: '16px', padding: '14px 32px', borderRadius: '999px', border: 'none', cursor: 'pointer', transition: 'background 0.2s ease', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, textDecoration: 'none' }}>
      {children}
    </button>
  );
}

// ── Secondary Button — adapts border colour to mode ──
function SecondaryButton({ children, onClick, mode = 'dark' }) {
  const theme = mode === 'white' ? themeWhite : themeDark;
  const [hov, setHov] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: 'transparent', color: hov ? theme.colors.accent : theme.colors.text, fontFamily: theme.font, fontWeight: 300, fontSize: '16px', padding: '14px 32px', borderRadius: '999px', border: `1px solid ${hov ? theme.colors.accent : theme.colors.border}`, cursor: 'pointer', transition: 'all 0.2s ease', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, textDecoration: 'none' }}>
      {children}
    </button>
  );
}

// ── Card — adapts bg/border to mode ──
function Card({ children, callout = false, mode = 'dark' }) {
  const theme = mode === 'white' ? themeWhite : themeDark;
  return (
    <div style={{ background: theme.colors.bgCard, border: `1px solid ${theme.colors.border}`, borderLeft: callout ? `4px solid ${theme.colors.accent}` : undefined, borderRadius: '8px', padding: '24px' }}>
      {children}
    </div>
  );
}

// ── Headings — always white (dark) or black (white), NEVER pink ──
const H1 = ({ children, mode = 'dark' }) => {
  const theme = mode === 'white' ? themeWhite : themeDark;
  return <h1 style={{ color: theme.colors.textHeading, fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', fontSize: theme.type.h1 }}>{children}</h1>;
};
const H2 = ({ children, mode = 'dark' }) => {
  const theme = mode === 'white' ? themeWhite : themeDark;
  return <h2 style={{ color: theme.colors.textHeading, fontWeight: 300, lineHeight: 1.2, letterSpacing: '-0.02em', fontSize: theme.type.h2 }}>{children}</h2>;
};
const H3 = ({ children, mode = 'dark' }) => {
  const theme = mode === 'white' ? themeWhite : themeDark;
  return <h3 style={{ color: theme.colors.textHeading, fontWeight: 300, lineHeight: 1.2, fontSize: theme.type.h3 }}>{children}</h3>;
};

// ── Stat ──
const Stat = ({ value, label }) => (
  <div>
    <div style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 300, color: '#E6035F', lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: '14px', color: '#808080', marginTop: '4px' }}>{label}</div>
  </div>
);

// ── Section Label ──
const SectionLabel = ({ children }) => <p style={{ color: '#E6035F', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>{children}</p>;

// ── Chevron motif — ALWAYS background-plain.png ──
<section style={{
  backgroundImage: "url('background-plain.png')",
  backgroundSize: 'cover',
  backgroundPosition: 'center right',
  backgroundRepeat: 'no-repeat',
  position: 'relative',
  padding: '80px 40px',
}}>
  {/* content sits on the left; chevron image occupies the right */}
</section>

// ── Icon usage (Lucide) ──
import { Zap, ArrowRight } from 'lucide-react';
// Dark mode:
<Zap size={20} strokeWidth={1.5} color="#FFFFFF" />
// White mode:
<Zap size={20} strokeWidth={1.5} color="#333333" />
// CTA context (both modes):
<ArrowRight size={20} strokeWidth={1.5} color="#E6035F" />
```

---

## Card & Grid Alignment Rules

Consistent alignment is non-negotiable. Every card grid, comparison layout, and vertical stack must follow these rules:

### Vertical Card Grids

1. **Equal height per row:** Use `align-items: stretch` on the grid container so all cards in a row match the tallest card's height.
2. **Flexbox columns inside cards:** Every `.card` must be `display: flex; flex-direction: column;` so internal content can distribute evenly.
3. **Push-to-bottom pattern:** The last child element (usually a CTA link or button) uses `margin-top: auto` to align at the bottom of every card, regardless of content length above it.
4. **Consistent internal spacing:** All child elements inside a card use the same spacing token (`--space-sm` between items). Never mix spacing values within cards in the same grid.
5. **Uniform padding:** Every card in a grid uses the same `padding` value. If one card has `--space-lg`, they all do.

### Horizontal Alignment

1. **Grid gap consistency:** Use a single `gap` value for the entire grid. Never vary gaps between columns.
2. **Text alignment within cards:** If one card's title is left-aligned, all titles in the grid are left-aligned.
3. **Icon/image sizing:** If cards have icons or images, they must be the same dimensions across all cards in the grid.
4. **Baseline alignment for stats:** When displaying stat callout numbers side-by-side, ensure the numbers baseline-align and the labels below them start at the same vertical position.

### Checklist (apply before finalising any card layout)

- [ ] All cards in the row are the same height
- [ ] CTA/link elements sit at the same vertical position across all cards
- [ ] Padding is identical across all cards
- [ ] Internal spacing between title, body, and CTA is consistent
- [ ] Icon/image dimensions match across cards
- [ ] Text alignment is uniform (all left, or all centre — never mixed)

```css
/* ── Correct card grid pattern ── */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-md);
  align-items: stretch; /* REQUIRED: equal heights */
}
.card {
  display: flex;          /* REQUIRED: flexbox column */
  flex-direction: column; /* REQUIRED: vertical stack */
  padding: var(--space-lg);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}
.card > *:not(:last-child) { margin-bottom: var(--space-sm); }
.card > *:last-child { margin-top: auto; } /* Push CTA to bottom */
```

---

## Sandbox & Artifact Compatibility Rules

When generating HTML for Claude artifacts or any sandboxed iframe environment, these rules apply in addition to all other brand and design rules.

### 1. No external JS icon libraries
Lucide UMD (`unpkg.com/lucide@latest`), Font Awesome CDN, and similar external JS icon libraries are **blocked** in Claude's sandboxed iframe. **Always use inline `<svg>` elements** for icons. Copy SVG paths from lucide.dev and embed directly. This also applies to any other CDN-hosted JS that manipulates the DOM (e.g., `lucide.createIcons()`).

### 2. CSS-only animations — never require JS for visibility
`IntersectionObserver` and similar JS-driven reveal patterns may not fire in sandboxed environments. Elements that start at `opacity: 0` will stay invisible if JS fails.
- Use CSS `animation` with `animation-fill-mode: both` as the primary reveal mechanism
- JS (IntersectionObserver, scroll listeners) may *enhance* but must never be *required* for content to appear
- If JS fails, all content must still be visible

### 3. Consistent section alignment — single container pattern
Every full-width section (hero, stats, content, CTA, footer) must use the **same box model** to ensure left/right edges align across the page:
```css
.section, .hero-inner, .stats-bar, .cta-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: [vertical] var(--space-xl);
}
```
For hero sections with a full-bleed background: the **outer** wrapper (`.hero`) has zero horizontal padding. The **inner** wrapper (`.hero-inner`) applies the shared `max-width + margin: 0 auto + padding` pattern. This prevents the hero content from sitting at a different left edge than other sections.

### 4. Button text centering for mixed font weights
`.btn-primary` (fw:700) and `.btn-secondary` (fw:300) have different font ascender metrics. With identical padding, lighter-weight text appears visually shifted upward.
- `.btn-primary`: `padding: 0.85rem 2rem` (symmetric)
- `.btn-secondary`: `padding: 0.9rem 2rem 0.8rem 2rem` (asymmetric — extra 0.05rem top to compensate)
- Both must use `display: inline-flex; align-items: center; justify-content: center; line-height: 1`

### 5. Hero backgrounds — never flat black
Marketing pages and landing pages must always apply an APV background composition to the hero section. Do not leave it as flat `#000000`.

**Dark mode backgrounds** (use `black-*` files):
- **Automotive pages:** `black-car.png`
- **Enterprise/people:** `black-crowd.png`
- **Global/sustainability:** `black-globe.png`
- **Infrastructure/scale:** `black-highway.png`
- **General/minimal:** `black-plain.png`

**White mode backgrounds** (use `white-*` files):
- **Automotive pages:** `white-car.jpg`
- **Enterprise/people:** `white-crowd.jpg`
- **Global/sustainability:** `white-globe.jpg`
- **Infrastructure/scale:** `white-highway.jpg`
- **General/minimal:** `white-plain.jpg`

Dark mode backgrounds already have the visual on the right and black space on the left for text — use directly as `background-image` with `background-size: cover; background-position: center right;`. No additional gradient overlay needed for the dark backgrounds since they have built-in black space. For white mode backgrounds, same approach.
- Text content always sits on the left; the background image shows through on the right

### 6. Chevron motif fallback for artifacts
When `black-plain.png` / `white-plain.jpg` is unavailable in a sandboxed environment and cannot be base64-embedded, use a CSS `clip-path` chevron as the decorative motif — **never a text character**:
```css
.hero-chevron {
  position: absolute; top: 50%; right: -5%; transform: translateY(-50%);
  width: 45%; height: 70%; opacity: 0.06;
  background: linear-gradient(135deg, var(--accent) 0%, transparent 60%);
  clip-path: polygon(0 0, 75% 50%, 0 100%);
  pointer-events: none;
}
```
This is a **last-resort fallback only** — always prefer the actual `background-plain.png` asset from the skill folder.

---

## What NOT to Do

**Brand violations:**
- ❌ Never use deep navy (`#0E2841`) — not an Appvantage colour
- ❌ Never use the teal/orange/green Microsoft Office colour scheme
- ❌ Never set any text to `font-weight: 400`, `500`, or `600`
- ❌ Never use Signature Pink as a large background fill
- ❌ Never use Signature Pink for destructive UI (errors, deletes)
- ❌ Never use gradient fills or heavy drop shadows
- ❌ Never write "AppVantage", "App Vantage", or "APV"
- ❌ Never use solid/filled icons
- ❌ **Never render the Appvantage chevron using any character, code, or drawing method.** This includes: `>`, `&gt;`, `&#62;`, CSS `content: ">"`, `::before`/`::after` pseudo-elements, SVG `<path>`, Canvas, Unicode arrows, or any font glyph. The chevron is a custom graphic asset — only `background-plain.png` (or a thematic variant) as a `background-image` or `<img>` element is correct.
- ❌ **Never reconstruct the logo wordmark in HTML/CSS text** (`app` + `vantage` + `>`). Always use `logo25-white.png` or `logo25-black.png` as an `<img>` tag.
- ❌ **Never use Signature Pink for headings** — headings are always white (dark mode) or black (white mode). Pink is for accents only: CTAs, links, stat numbers, section labels
- ❌ **Never mix dark and white tokens** in the same artifact — pick one mode and commit
- ❌ **Never use `#595959` or darker for text on black** — minimum grey on dark backgrounds is `#808080` (5.32:1 WCAG AA)
- ❌ **Never use fixed px for web text** — use rem tokens that scale from the root font-size
- ❌ **Never skip card alignment rules** — cards in a grid must be equal height with CTAs bottom-aligned
- ❌ **Never use `display: inline-block` for buttons** — always use `display: inline-flex; align-items: center; justify-content: center;` with `line-height: 1` to ensure text is vertically centred regardless of font-weight differences between primary (700) and secondary (300) buttons
- ❌ **Never render the logo as styled HTML text** — not `<span>app</span><span style="color:#E6035F">vantage</span>`, not any variation. The logo is always an `<img>` tag. There is no acceptable text fallback. If the image is unavailable, show nothing.
- ❌ **Never use external CDN scripts for icons in HTML artifacts** — Lucide UMD, Font Awesome JS, etc. are blocked in sandboxed environments. Always use inline `<svg>`.
- ❌ **Never use `IntersectionObserver` as the sole visibility trigger** — content starting at `opacity: 0` will be permanently invisible if JS doesn't fire. Use CSS `animation` with `fill-mode: both`.
- ❌ **Never leave a marketing hero section as flat black** — always apply an APV background composition with gradient overlay.
- ❌ **Never omit the favicon from any HTML output.** Every Appvantage page must include `logosymbol.png` as a base64-encoded favicon (`<link rel="icon">`). For AutoRetain pages, use `retain-fav-icon.png`. A page without a branded favicon is incomplete.
- ❌ **Never use images from the live appvantage.co website or framerusercontent.com** — always source brand assets from the skill folder (`/mnt/skills/user/appvantage-brand/`), SharePoint `Appvantage-Logo+25`, or the Confluence Brand Visual page.

**Design quality failures:**
- ❌ Generic card grid with equal padding everywhere — vary density intentionally
- ❌ Centred hero with centred CTA — left-aligned or asymmetric composition is more distinctive
- ❌ Equal visual weight on every element — establish a clear hierarchy per section
- ❌ Animation on every element — animate what matters, leave the rest still
- ❌ Flat information architecture — use depth (layered cards, modals, drawers) for spatial sense

---

## Social Media Guidelines

### Platforms

| Platform | URL | Tone |
|----------|-----|------|
| Facebook | [facebook.com/appvantage](https://www.facebook.com/appvantage/) | Warm, celebratory, community-focused |
| LinkedIn | [linkedin.com/company/appvantage-asia](https://www.linkedin.com/company/appvantage-asia) | Professional, achievement-oriented, community-minded |

### Profile & Cover Images

- **Profile picture:** `logosymbol.png` (chevron on Signature Pink background) — used across all platforms
- **Cover/banner:** Dark mode brand background or current campaign visual. Use `black-plain.png` or thematic variant as a base.

### Post Guidelines

- **No watermark** on post images
- **No mandatory template** for image posts — creative freedom within brand tokens
- **Dark backgrounds preferred** for graphic posts (aligns with brand identity), but white is acceptable
- **Logo placement:** Only include in cover/profile — not overlaid on every post image
- **Text on images:** Acumin Pro Light (or Calibri fallback). White on dark, black on white. Signature Pink for accent words only.

### Hashtag Strategy

**Always-use (brand hashtags):**
`#appvantage` `#drivingsustainableinnovation`

**Contextual (use when relevant):**

| Category | Hashtags |
|----------|----------|
| AI / Tech | `#AIpowered` `#digitalinnovation` `#artificialintelligence` `#machinelearning` |
| Automotive | `#automotivedigital` `#autoretail` `#digitaldealer` `#connectedcar` |
| Product | `#AutoRetain` |
| Industry | `#fintech` `#assetfinance` `#digitaltransformation` `#enterprisetech` |
| Culture / Team | `#lifeAtAppvantage` `#greatplacetowork` `#techcareers` `#singaporetech` |
| Events / Seasonal | Use relevant event/holiday hashtags (e.g., `#CNY2026` `#SFF2026`) |

**Rules:** Max 5–8 hashtags per post. Brand hashtags first, contextual after. No hashtag walls.

---

## Co-branding & Partner Logo Rules

When the Appvantage logo appears alongside partner or client logos — in decks, case studies, "trusted by" sections, or joint marketing — follow these rules.

### Hierarchy

1. **Appvantage takes visual prominence.** The Appvantage logo is always equal to or larger than partner logos. Never smaller.
2. **Reading order:** Appvantage logo appears first (top-left, or leftmost in a horizontal row).
3. **Never merge** the Appvantage logo with a partner logo into a combined lock-up or composite mark.

### "Trusted By" / Client Logo Grids

- **Render partner logos in monochrome** (greyscale) to preserve the Appvantage monochromatic palette and avoid visual clutter. This follows the same principle used by Apple and Google in their partner ecosystems — the host brand's visual system takes precedence.
- All client logos at **equal size and visual weight** — no logo should dominate the grid.
- Consistent spacing: minimum gap between logos = 2× the Appvantage logo clear space (height of lowercase "a").
- **Dark mode:** White/light grey monochrome logos on black or `#111111` card.
- **White mode:** Dark grey monochrome logos on white or `#F5F5F5` card.

### Co-branded Marketing (joint case studies, partnerships)

- Partner logos may appear in **original brand colours** when the partnership itself is the subject.
- Appvantage logo still appears first in reading order.
- Maintain clear visual separation — never interleave logos in a single line.
- Use a neutral divider (thin `#1A1A1A` or `#E8E8E8` line, or generous whitespace) between the two brands.

### Co-branding Don'ts

- ❌ Never place the Appvantage logo smaller than a partner logo
- ❌ Never recolour the Appvantage logo to match a partner's brand colours
- ❌ Never create combined logo lock-ups
- ❌ Never place partner logos on Appvantage brand backgrounds without monochrome treatment (unless in co-branded context)

---

## Video & Motion Graphics

Appvantage video content follows the same visual principles as all other brand touchpoints — dark-dominant, cinematic, Acumin Pro typography, Signature Pink as accent.

### Intro (3–4 seconds)

- **Background:** Black (`#000000`) with subtle grain texture or `black-plain.png` chevron motif
- **Animation:** Appvantage logo (`logo25-white.png`) fades in from centre with a gentle scale-up (1.0→1.02→1.0, ease-out). No bounce, no spin.
- **Sound:** Optional — a short, clean audio signature (low-frequency tone). No jingles.
- **Timing:** Logo holds for 1.5s after animation completes, then cross-dissolve to content.

### Outro (3–4 seconds)

- **Background:** Black with chevron motif
- **Content:** Appvantage logo centred, tagline "driving sustainable innovation" in Tagline Grey (`#808080`) below, 14px Acumin Pro Light
- **Optional:** Website URL `appvantage.co` in Tagline Grey, positioned below tagline
- **Animation:** Content fades in with staggered timing (logo → tagline → URL, 200ms apart)

### Lower Thirds (name/title overlays)

- **Background:** Semi-transparent black (`rgba(0,0,0,0.75)`), pill-shaped (border-radius `--radius-pill`)
- **Name:** White, Acumin Pro Light, 18px
- **Title:** Tagline Grey (`#808080`), Acumin Pro Light, 14px
- **Accent:** Thin Signature Pink left-border (3px) on the pill
- **Position:** Lower-left, with safe-zone padding (10% from edges)
- **Animation:** Slide in from left (200ms ease-out), hold, slide out left

### Title Cards

- **Background:** Black or brand background (`black-plain.png`)
- **Title:** White, Acumin Pro Light, centred or left-aligned, same scale as H1 (54px equivalent)
- **Subtitle:** Tagline Grey, 24px Acumin Pro Light
- **Pink accent:** Optional section label or thin accent bar (max 1 pink element per card)

### General Rules

- **Font:** Acumin Pro Light for all on-screen text. Calibri as fallback.
- **Transitions:** Cross-dissolve or cut. No wipes, star transitions, or novelty effects.
- **Colour grading:** Cool-neutral grade, slight desaturation, high contrast. Dark scenes should feel cinematic, not flat.
- **Safe zones:** Keep all text and logos within 90% of frame (5% padding on all sides) for platform compatibility.
- **Resolution:** 1920×1080 (16:9) minimum. 4K preferred for flagship content.
- **Frame rate:** 24fps for cinematic feel, 30fps for screen recordings/demos.

---

## UI Components (shadcn/ui + Tailwind CSS)

For UI components beyond the core brand patterns (buttons, cards, nav, hero, stats), Appvantage follows **shadcn/ui conventions styled with Appvantage brand tokens via Tailwind CSS**.

**Reference implementation:** [Dashtail](https://dash-tail.vercel.app/en/dashboard) (Next.js admin template built on shadcn/ui + Tailwind)

**Icon library:** [Lucide Icons](https://lucide.dev/) — line-style, 1.5–2px stroke

### Brand Token Override Layer

Map Appvantage brand tokens to shadcn/ui's CSS variable theming system. This ensures every shadcn component auto-inherits Appvantage colours, fonts, and radii without per-component overrides.

**Dark mode (`theme: "dark"`):**

```css
:root {
  --background: 0 0% 0%;           /* #000000 */
  --foreground: 0 0% 100%;         /* #FFFFFF */
  --card: 0 0% 7%;                 /* #111111 */
  --card-foreground: 0 0% 100%;    /* #FFFFFF */
  --primary: 340 97% 46%;          /* #E6035F — Signature Pink */
  --primary-foreground: 0 0% 100%; /* White text on pink */
  --secondary: 0 0% 7%;            /* #111111 */
  --secondary-foreground: 0 0% 100%;
  --muted: 0 0% 10%;               /* #1A1A1A */
  --muted-foreground: 0 0% 50%;    /* #808080 */
  --accent: 340 97% 46%;           /* #E6035F */
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;        /* Standard red — never use Signature Pink for destructive */
  --border: 0 0% 10%;              /* #1A1A1A */
  --input: 0 0% 10%;               /* #1A1A1A */
  --ring: 340 97% 46%;             /* #E6035F focus ring */
  --radius: 0.5rem;                /* 8px — matches --radius-md */
  --font-sans: 'Acumin Pro', Calibri, 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
```

**White mode (`theme: "light"`):**

```css
:root {
  --background: 0 0% 100%;         /* #FFFFFF */
  --foreground: 0 0% 0%;           /* #000000 */
  --card: 0 0% 96%;                /* #F5F5F5 */
  --card-foreground: 0 0% 20%;     /* #333333 */
  --primary: 340 97% 46%;          /* #E6035F */
  --primary-foreground: 0 0% 100%;
  --secondary: 0 0% 96%;           /* #F5F5F5 */
  --secondary-foreground: 0 0% 20%;
  --muted: 0 0% 96%;               /* #F5F5F5 */
  --muted-foreground: 0 0% 50%;    /* #808080 */
  --accent: 340 97% 46%;           /* #E6035F */
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --border: 0 0% 91%;              /* #E8E8E8 */
  --input: 0 0% 91%;               /* #E8E8E8 */
  --ring: 340 97% 46%;             /* #E6035F focus ring */
  --radius: 0.5rem;
  --font-sans: 'Acumin Pro', Calibri, 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
```

### Component Notes

- **Forms (inputs, selects, checkboxes, radio):** Use shadcn/ui defaults with brand token overrides above. Font weight 300 for all form text.
- **Tables:** Follow Dashtail data table patterns. Stripe colour = `--card` on alternating rows. Sort indicators in `--muted-foreground`.
- **Modals/Dialogs:** Background overlay `rgba(0,0,0,0.6)`. Modal surface uses `--card`. Close button top-right with Lucide `X` icon.
- **Toasts/Notifications:** Bottom-right position. Success = green, error = red (never Signature Pink for errors), info = `--muted-foreground`.
- **Tabs:** Active tab underline or fill in `--primary`. Inactive tabs in `--muted-foreground`.
- **Loading/Skeleton:** Use `--muted` background with subtle pulse animation. No spinner colours outside brand palette.
- **Empty states:** Centred illustration area + heading in `--foreground` + description in `--muted-foreground` + CTA button in `--primary`.
- **Do not redefine every component.** The token override layer handles 90% of cases. Only document Appvantage-specific deviations here.

---

## Document Structure Templates

### Client Proposal

| Section | Content | Notes |
|---------|---------|-------|
| 1. Cover Page | Appvantage logo, project title, client name, date | Use title slide layout (dark or white) |
| 2. Executive Summary | 1-page overview: problem, solution, expected outcome | Lead with client's challenge, not Appvantage credentials |
| 3. Understanding | Client's situation, pain points, goals | Demonstrate deep understanding — partner tone, not vendor |
| 4. Proposed Solution | Architecture, approach, key features | Visual diagrams where possible |
| 5. Implementation Roadmap | Phases, milestones, timeline | Gantt or phase diagram |
| 6. Team & Expertise | Relevant team members, credentials | Include proof points |
| 7. Investment | Pricing, payment terms | Clear table format |
| 8. Why Appvantage | Differentiators, relevant case studies | Short, evidence-based |
| 9. Next Steps | Clear call to action | One CTA, not a menu |
| 10. Appendix | Technical details, certifications, full case studies | Optional |

### Internal Report

| Section | Content |
|---------|---------|
| 1. Title & Date | Report name, period covered, author |
| 2. Summary / TLDR | 3–5 bullet key findings up front |
| 3. Context | Why this report exists, what triggered it |
| 4. Findings / Analysis | Data, insights, charts — the substance |
| 5. Recommendations | Clear, actionable next steps |
| 6. Appendix | Supporting data, methodology |

### Case Study

| Section | Content |
|---------|---------|
| 1. Title | Client name + one-line result |
| 2. Challenge | What the client was facing |
| 3. Solution | What Appvantage built/delivered |
| 4. Results | Quantified outcomes (metrics, percentages, timelines) |
| 5. Quote | Client testimonial (if available) |
| 6. Tech Stack | Technologies used (brief) |

**Design rules for all documents:**
- Cover page uses brand background (dark or white theme)
- Internal documents default to white mode; client-facing defaults to dark mode (ask user)
- All headings in Acumin Pro Light (Calibri fallback), never bold except web CTA buttons
- Signature Pink for section labels and stat callouts only — never for headings
- Footer: date, copyright, page number on every content page

---

## Favicon & App Icon Specifications

### Favicon

| Size | Format | Usage |
|------|--------|-------|
| 16×16 | `.ico` or `.png` | Browser tab |
| 32×32 | `.png` | Browser tab (high-DPI) |
| 48×48 | `.png` | Windows taskbar |

**Design:** Chevron symbol from `logosymbol.png` on Signature Pink (`#E6035F`) background. At 16×16, simplify to just the chevron shape — remove fine details that become illegible.

### Apple Touch Icon

| Size | Format | Usage |
|------|--------|-------|
| 180×180 | `.png` | iOS home screen |

**Design:** Chevron on Signature Pink. Include 10% safe-area padding on all sides. iOS applies its own rounded corners — do not bake in corner radius.

### Android / PWA Icons

| Size | Format | Usage |
|------|--------|-------|
| 192×192 | `.png` | Android home screen, PWA |
| 512×512 | `.png` | PWA splash, Play Store |

**Design:** Same chevron on pink. For maskable icons, ensure the chevron sits within the 80% safe zone (centred).

### Open Graph / Social Sharing

| Size | Format | Usage |
|------|--------|-------|
| 1200×630 | `.png` or `.jpg` | Default OG image for link previews |

**Design:** Black background, appvantage> logo (`logo25-white.png`) centred, tagline below in Tagline Grey. Clean, minimal — no busy layouts.

**Source asset:** `logosymbol.png` (chevron on pink) from the skill folder.

### AutoRetain Icons

AutoRetain has its own dedicated favicon and app icon assets, separate from the Appvantage chevron:

| Asset | File | Usage |
|-------|------|-------|
| Favicon | `retain-fav-icon.png` | Browser favicon, notification badge — tight crop of the "R" symbol |
| App icon | `retain-admin-logo.png` | In-app sidebar, PWA icon, mobile home screen — square "R" symbol with sparkles |

**Design:** The stylised "R" with sparkle accents in Signature Pink on transparent background. For favicon sizes (16×16, 32×32), the sparkle details may be simplified for legibility. For app icons requiring a background, use white (`#FFFFFF`) or black (`#000000`) depending on context.

> **When building AutoRetain interfaces:** Use `retain-fav-icon.png` for the `<link rel="icon">` tag and `retain-admin-logo.png` for sidebar/nav branding. Never use the Appvantage chevron (`logosymbol.png`) as the AutoRetain favicon — AutoRetain has its own identity.

---

## Accessibility Standards

Appvantage targets **WCAG 2.1 AA compliance** as the baseline for all digital outputs.

### Colour Contrast

| Element | Minimum Ratio | Status |
|---------|---------------|--------|
| Body text on dark (`#FFFFFF` on `#000000`) | 21:1 | Passes AAA |
| Body text on white (`#333333` on `#FFFFFF`) | 12.6:1 | Passes AAA |
| Secondary text (`#808080` on `#000000`) | 5.32:1 | Passes AA |
| Secondary text (`#808080` on `#FFFFFF`) | 3.95:1 | Passes AA (large text) |
| Pink CTA text (`#FFFFFF` on `#E6035F`) | 4.58:1 | Passes AA |
| Pink on black (`#E6035F` on `#000000`) | 4.57:1 | Passes AA (large text / UI components only) |

> **Minimum grey on dark backgrounds is `#808080`** (5.32:1). Never use anything darker for text on `#000000` or `#111111`.

### Focus States

- **Default focus indicator:** 2px solid Signature Pink (`#E6035F`) outline with 2px offset. Visible on both dark and white modes.
- **On pink elements (buttons):** 2px solid white outline with 2px offset (pink-on-pink would be invisible).
- **Never remove focus outlines.** Use `:focus-visible` to show only for keyboard navigation, not mouse clicks.

```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.btn-primary:focus-visible {
  outline: 2px solid #FFFFFF;
  outline-offset: 2px;
}
```

### Reduced Motion

Respect `prefers-reduced-motion`. When enabled, disable all CSS animations and transitions. Content must be immediately visible — no fade-ins, slide-ins, or staggered reveals.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Touch Targets

- Minimum interactive target size: **44×44px** (WCAG 2.5.5)
- Buttons, links, and form controls must meet this minimum on mobile
- Inline text links are exempt but should have generous line-height (1.5+)

### Screen Reader Considerations

- **Logo alt text:** `alt="Appvantage"` — not `alt="appvantage logo"` or `alt="appvantage>"`. The alt text is the brand name, not a description of the image.
- **Decorative images:** Chevron backgrounds, grain overlays, and atmospheric elements use `alt=""` and `aria-hidden="true"`.
- **Landmark roles:** Use semantic HTML (`<nav>`, `<main>`, `<footer>`, `<section>`) — not `<div>` with ARIA roles as a substitute.
- **Heading hierarchy:** Never skip heading levels (H1 → H3). Every page has exactly one H1.
- **Link text:** Descriptive — "View case study" not "Click here". "Contact us" not "Learn more".
- **Form labels:** Every input has a visible `<label>` element. Placeholder text is not a substitute for labels.

### Keyboard Navigation

- All interactive elements reachable via Tab key
- Logical tab order (follows visual reading order)
- Escape key closes modals, dropdowns, and overlays
- Arrow keys navigate within tab groups, dropdowns, and menus
- Enter/Space activates buttons and links

---

## Long-form Content Hierarchy

For blog posts, whitepapers, case studies, and technical articles published under the Appvantage brand.

### Heading Nesting

- **H1:** Page/article title — exactly one per page
- **H2:** Major section headings
- **H3:** Subsection headings within an H2
- **H4:** Rarely needed — use for sub-subsections in long whitepapers only
- Never skip levels. Never use headings for visual sizing — use CSS classes instead.

### Pull Quotes

Used to highlight a key insight or client testimonial mid-article.

**Dark mode:**
- Left border: 4px Signature Pink (`#E6035F`)
- Background: `#111111` card
- Text: White, Acumin Pro Light, `1.125rem` (Body Large)
- Attribution: Tagline Grey (`#808080`), `0.875rem`

**White mode:**
- Left border: 4px Signature Pink
- Background: `#F5F5F5`
- Text: `#333333`, same font/size
- Attribution: `#808080`

### Callout Boxes

For tips, warnings, key takeaways, or important notes.

| Type | Left Border | Icon (Lucide) | Usage |
|------|-------------|---------------|-------|
| Info | `#808080` | `Info` | General information, context |
| Tip | `#E6035F` | `Lightbulb` | Best practices, recommendations |
| Warning | `#F59E0B` (amber) | `AlertTriangle` | Cautions, potential issues |
| Success | `#10B981` (green) | `CheckCircle` | Confirmed results, achievements |

> **Note:** Warning and success use functional colours (amber, green) — these are exceptions to the monochromatic palette, justified by UX convention for scannability. These functional colours are for callout boxes only — never for brand elements.

### Image Captions

- Position: Below image, left-aligned
- Font: Acumin Pro Light, `0.8rem` (Caption token)
- Colour: Tagline Grey (`#808080`)
- Format: Descriptive caption. Source/credit in parentheses if applicable.

### Footnotes & Citations

- Superscript numbers in body text, linked to footnote section
- Footnote section at bottom of article, above the page footer
- Font: `0.75rem` (Small/Legal token), Tagline Grey
- Format: `[1] Author, Title, Source, Year.`

### Article Metadata Block

Display at the top of every article, below the H1:

- **Author name** — Body Small, primary text colour
- **Publication date** — Caption size, Tagline Grey, format `DD MMM YYYY`
- **Reading time** — Caption size, Tagline Grey (e.g., "5 min read")
- **Category/tags** — Caption size, Signature Pink, uppercase, letter-spacing `0.12em`

---

## Graphic Assets

**Primary source (for Claude):** Skill folder at `/mnt/skills/user/appvantage-brand/` — contains logo, tagline, symbol, font, and background PNGs bundled with this skill.

**Canonical source:** SharePoint — [Appvantage Graphic Assets Folder](https://appvantageco.sharepoint.com/:f:/s/AppvantagePteLtd/EiEGtuOn8QhKhc3V6_3n96MBWO57jJVqUOTvuP_TDgewPA?e=PHebav)

**Brand reference page:** Confluence — [Appvantage Brand Visual](https://appvantage.atlassian.net/wiki/spaces/AD/pages/35946504/Appvantage+Brand+Visual)

**Asset hierarchy (in order of preference):**
1. Skill folder (`/mnt/skills/user/appvantage-brand/`) — use for all Claude outputs
2. SharePoint `Appvantage-Logo+25` folder — canonical source of truth
3. Confluence Brand Visual page — reference and verification

**Never use:** Images scraped from the live website (`appvantage.co` or `framerusercontent.com` URLs). Always use the original asset files from the sources above.

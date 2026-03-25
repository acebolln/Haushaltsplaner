# Design System: Warm & Friendly Petrol

## Overview

This document describes the UX design refresh applied to the Haushaltsplaner app. The refresh transforms the previous grayscale color scheme into a warm, friendly, and inviting design using petrol/teal tones with green-to-yellow accents.

## Design Philosophy

**Style:** Soft & Friendly
- Warm, inviting color palette
- Rounded, pill-style buttons
- Soft shadows instead of harsh borders
- Individual icon colorization
- Subtle background gradients

## Color Palette (OKLCH Format)

### Primary Colors

**Petrol/Teal (Primary Brand Color)**
```css
--primary: oklch(0.55 0.12 200)
--primary-foreground: oklch(0.98 0 0)
```
Used for: Primary buttons, key UI elements, main brand identity

**Secondary (Light Teal)**
```css
--secondary: oklch(0.95 0.02 200)
--secondary-foreground: oklch(0.30 0.08 200)
```
Used for: Secondary buttons, subtle highlights

### Accent Colors (Green → Yellow Gradient)

**Fresh Green**
```css
oklch(0.65 0.15 150)
```
Used for: Income, positive indicators, success states

**Autumn Yellow**
```css
oklch(0.75 0.14 85)
```
Used for: Savings, warnings, attention states

**Teal Accent**
```css
oklch(0.60 0.13 180)
```
Used for: Variable costs, housing, complementary elements

### Chart Colors

The donut chart uses a warm, harmonious spectrum:

1. **Fixkosten (Fixed Costs):** `oklch(0.55 0.12 200)` — Petrol
2. **Variable (Variable Costs):** `oklch(0.65 0.15 150)` — Green
3. **Sparen (Savings):** `oklch(0.75 0.14 85)` — Yellow
4. **Hauskosten (Housing):** `oklch(0.60 0.13 180)` — Teal

### Status Colors (Semantic)

**Very Good (>500€ reserve)**
```css
--status-very-good: oklch(0.65 0.15 150)  /* Warm green */
```

**Sufficient (>300€ reserve)**
```css
--status-sufficient: oklch(0.75 0.14 85)  /* Autumn yellow */
```

**Tight (>0€ reserve)**
```css
--status-tight: oklch(0.70 0.16 50)  /* Warm orange */
```

**Critical (≤0€ reserve)**
```css
--status-critical: oklch(0.60 0.20 25)  /* Warm red */
```

### Category Icon Colors

Each category has its own distinctive color:

- **Income (Einnahmen):** `oklch(0.65 0.15 150)` — Green (growth, positive)
- **Fixed (Fixkosten):** `oklch(0.55 0.12 200)` — Petrol (stability, primary)
- **Variable (Haushalt):** `oklch(0.60 0.13 180)` — Teal (flexibility)
- **Savings (Sparen):** `oklch(0.75 0.14 85)` — Yellow (warmth, value)
- **Housing (Hauskosten):** `oklch(0.60 0.13 180)` — Teal (home, shelter)

### Background & Layout

**Background Gradient**
```css
background: radial-gradient(
  ellipse at top,
  oklch(0.98 0.01 200),  /* Light petrol center */
  oklch(0.99 0.005 200)  /* Warm white edges */
);
```

**Borders & Inputs**
```css
--border: oklch(0.90 0.01 200)  /* Soft petrol tint */
--input: oklch(0.90 0.01 200)
```

**Muted Elements**
```css
--muted: oklch(0.96 0.01 200)  /* Warm gray background */
--muted-foreground: oklch(0.50 0.02 200)  /* Medium gray text */
```

## Border Radius & Shape

### Global Radius
```css
--radius: 1rem  /* 16px - increased from 10px */
```

### Component-Specific

**Buttons:** `rounded-full` (pill-style)
- Creates friendly, approachable feel
- Distinguishes interactive elements
- All sizes maintain pill shape

**Cards:** `rounded-2xl` (increased from `rounded-xl`)
- Softer, more inviting appearance
- Matches overall friendly aesthetic

## Shadows

**Cards:** Soft shadow with primary color tint
```css
shadow-md shadow-primary/5
```
Replaces previous `ring-1 ring-foreground/10` for softer appearance.

**Bottom Bar:** Backdrop blur with transparency
```css
bg-background/95 backdrop-blur-sm
```

## Component Changes

### Updated Files

1. **`app/globals.css`**
   - Complete color palette overhaul
   - Increased border radius
   - Added background gradient
   - Custom category and status color variables

2. **`components/ui/button.tsx`**
   - Changed to `rounded-full` for pill-style
   - All size variants maintain rounded appearance

3. **`components/ui/card.tsx`**
   - Changed to `rounded-2xl`
   - Replaced `ring-1` with `shadow-md shadow-primary/5`
   - Updated all sub-components (header, footer)

4. **`components/budget/BudgetPlanner.tsx`**
   - Updated chart data colors to OKLCH format
   - Aligned with new warm palette

5. **`components/budget/DonutChart.tsx`**
   - Uses new chart colors from BudgetPlanner
   - Maintains smooth transitions

6. **`components/budget/StatusIndicator.tsx`**
   - Updated via `status-rules.ts`
   - Warmer semantic colors

7. **`components/budget/CategorySection.tsx`**
   - Added individual icon colorization
   - Each category has distinctive color
   - Updated action button colors (save/cancel)

8. **`components/budget/StickyBottomBar.tsx`**
   - Colorized all metric icons
   - Added backdrop blur effect
   - Aligned colors with category system

9. **`components/budget/BudgetItem.tsx`**
   - Updated edit/delete icon colors
   - Consistent warm color scheme

10. **`components/budget/ScenarioManager.tsx`**
    - Updated delete icon color
    - Maintains warm aesthetic

11. **`lib/budget/status-rules.ts`**
    - Replaced Tailwind utility classes with OKLCH
    - Warmer semantic colors
    - Better visual hierarchy

## Accessibility

All color combinations maintain WCAG AA contrast ratios:
- Text on backgrounds: >4.5:1
- Large text: >3:1
- Interactive elements clearly distinguishable
- Color not sole indicator of state (icons + labels used)

## Visual Hierarchy

1. **Primary Actions:** Petrol buttons with pill shape
2. **Category Icons:** Individual colors for quick scanning
3. **Status Indicators:** Color + icon + label (triple encoding)
4. **Metric Cards:** Color-coded for instant recognition
5. **Background:** Subtle gradient doesn't compete with content

## Design Rationale

### Why Petrol/Teal?
- Professional yet warm
- Stands out from typical blue financial apps
- Evokes trust and stability
- Works well with green (income) and yellow (savings)

### Why Green → Yellow Gradient?
- Natural, organic feel
- Green = growth, positive (income)
- Yellow = warmth, value (savings)
- Smooth transition creates visual harmony

### Why Pill-Style Buttons?
- Friendlier, more approachable
- Clear call-to-action
- Modern design pattern
- Distinguishes interactive elements

### Why Soft Shadows?
- Less harsh than borders
- Creates depth without aggression
- Aligns with "soft & friendly" theme
- Modern, elevated feel

### Why Individual Icon Colors?
- Faster visual scanning
- Reduces cognitive load
- Creates visual interest
- Reinforces category identity

## Future Enhancements

Potential improvements for future iterations:

1. **Dark Mode:** Create dark variant with adjusted OKLCH lightness values
2. **Animations:** Add subtle spring animations to charts
3. **Illustrations:** Custom SVG illustrations for empty states
4. **Patterns:** Geometric patterns for backgrounds
5. **Gradients:** Explore gradient buttons for CTAs
6. **Micro-interactions:** Hover/focus states with color shifts

## Testing

All changes verified:
- ✅ TypeScript: No errors
- ✅ Production build: Successful
- ✅ Functionality: All features work
- ✅ Responsiveness: Maintains layout integrity
- ✅ Accessibility: WCAG AA compliant

## Conclusion

This design refresh transforms the Haushaltsplaner from a functional grayscale tool into a warm, friendly, and inviting application. The petrol/green/yellow palette creates a distinctive brand identity while maintaining professional credibility. The soft, rounded shapes and individual color assignments make the interface more approachable and easier to navigate.

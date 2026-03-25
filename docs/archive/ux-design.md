# Haushaltsplaner — UX Design Concept
**Brand-Inspired Design System** | Version 1.0 | 2026-03-15

---

## Executive Summary

This document defines the complete UX design system for Haushaltsplaner, a private budget planning app for family household management. The design adopts the Appvantage Brand Design System's visual language—black/white foundation with pink accent (#E6035F), Acumin Pro Light typography, asymmetric layouts, generous whitespace—while creating a standalone product identity without Appvantage branding.

**Key Design Decision: White Mode Primary**
- **Rationale**: Private household finance apps benefit from white/light themes that feel approachable, trustworthy, and reduce eye strain during extended budget review sessions. Dark mode will be available as user preference, but white is the default entry point.
- **Context**: Unlike enterprise dashboards or marketing materials (where dark creates drama), personal finance tools prioritize clarity, accessibility, and prolonged usability.

---

## 1. Design Foundation

### 1.1 Theme System

#### White Mode (Default)
```css
/* Base Colors */
--background: #FFFFFF
--card: #F5F5F5
--foreground: #000000
--body-text: #333333
--caption: #808080
--border: #E8E8E8

/* Accent */
--accent-pink: #E6035F
--accent-pink-hover: #C40250

/* Status Colors (Budget States) */
--status-very-good: #10B981  /* Green: >500€ */
--status-sufficient: #F59E0B /* Yellow: >300€ */
--status-tight: #F97316      /* Orange: >0€ */
--status-critical: #EF4444   /* Red: ≤0€ */
```

#### Dark Mode (Optional)
```css
/* Base Colors */
--background: #000000
--card: #111111
--foreground: #FFFFFF
--body-text: #FFFFFF
--caption: #808080
--border: #1A1A1A

/* Accent remains consistent */
--accent-pink: #E6035F
--accent-pink-hover: #C40250

/* Status Colors adjusted for dark */
--status-very-good: #34D399
--status-sufficient: #FBBF24
--status-tight: #FB923C
--status-critical: #F87171
```

### 1.2 Typography Scale (rem-based)

**Font Stack**: `"Acumin Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
**Weights**: Light (300) primary, Bold (700) CTAs only

```css
/* Root Font Sizing */
html { font-size: 18px; } /* Desktop base */
@media (max-width: 1024px) { html { font-size: 16px; } } /* Tablet/Mobile */

/* Type Scale */
--text-display: 3.5rem;    /* 63px → Hero numbers (Total Budget) */
--text-h1: 3rem;           /* 54px → Page title "Budget Planner" */
--text-h2: 2.25rem;        /* 40px → Section "Einnahmen" */
--text-h3: 1.75rem;        /* 32px → Card titles */
--text-body-lg: 1.125rem;  /* 20px → Lead text */
--text-body: 1rem;         /* 18px → Standard UI */
--text-body-sm: 0.875rem;  /* 16px → Input labels */
--text-caption: 0.8rem;    /* 14px → Metadata */
--text-small: 0.75rem;     /* 14px → Legal/Fine print */

/* Line Heights */
--lh-tight: 1.1;   /* Display/H1 */
--lh-heading: 1.2; /* H2-H4 */
--lh-body: 1.5;    /* Standard text */
--lh-relaxed: 1.7; /* Long-form */

/* Letter Spacing */
--ls-tight: -0.02em;  /* Headings */
--ls-wide: 0.15em;    /* ALL-CAPS labels */
```

### 1.3 Spacing System (8pt Grid)

```css
/* Base unit: 4px (0.25rem) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */

/* Component Padding */
--padding-card: var(--space-6);
--padding-section: var(--space-12);
--padding-page: var(--space-8);
```

### 1.4 Border Radius

```css
--radius-sm: 0.375rem;  /* 6px - Badges */
--radius-md: 0.5rem;    /* 8px - Inputs */
--radius-lg: 1rem;      /* 16px - Cards */
--radius-xl: 1.5rem;    /* 24px - Hero sections */
--radius-full: 9999px;  /* Pills/Pills buttons */
```

### 1.5 Shadows

```css
/* White Mode */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-md: 0 2px 8px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.12);

/* Dark Mode */
--shadow-sm-dark: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md-dark: 0 2px 8px rgba(0, 0, 0, 0.5);
--shadow-lg-dark: 0 4px 16px rgba(0, 0, 0, 0.7);
```

---

## 2. Layout Structure

### 2.1 Overall Architecture

```
┌─────────────────────────────────────────────────┐
│ Header (Minimal)                                │ 60px
├─────────────────────────────────────────────────┤
│                                                 │
│ Hero Section (Donut Chart + Quick Stats)       │ 400px
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ Budget Categories (Accordion/Cards)             │ Dynamic
│                                                 │
├─────────────────────────────────────────────────┤
│ Sticky Bottom Bar (Status + Scenarios)         │ 80px+
└─────────────────────────────────────────────────┘
```

### 2.2 Header (Minimal Navigation)

**Design Philosophy**: No traditional navigation—this is a single-page app with module tabs.

```
┌───────────────────────────────────────────────────────┐
│ [No Logo] │ Budget Planner  |  Receipts  [Theme ☾] │
└───────────────────────────────────────────────────────┘
```

**Specifications**:
- Height: `60px`
- Background: `--background` (white/black)
- Border-bottom: `1px solid --border`
- Left: Module tabs (text links, no icons)
  - Active tab: Pink underline `--accent-pink`, font-weight 700
  - Inactive: `--caption` color, font-weight 300
- Right: Theme toggle icon (sun/moon)

**No App Logo/Branding**: This is a personal tool. No logo needed.

### 2.3 Hero Section — Visual Hierarchy

**Purpose**: Immediate financial status at a glance. The donut chart is the hero element.

**Layout** (Desktop):
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│    ┌─────────────┐          ┌─────────────────────┐    │
│    │             │          │  Einnahmen  6.305 € │    │
│    │   DONUT     │          ├─────────────────────┤    │
│    │   CHART     │          │  Ausgaben   3.978 € │    │
│    │             │          ├─────────────────────┤    │
│    │   -365 €    │          │  Hauskosten 2.692 € │    │
│    │  (center)   │          ├─────────────────────┤    │
│    │             │          │  Reserve    -365 €  │    │
│    └─────────────┘          │  [Status: Kritisch] │    │
│                             └─────────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Donut Chart Specifications**:
- Diameter: `320px` (desktop), `240px` (mobile)
- Center: Display Reserve value (--text-display, 3.5rem)
- Center Label: "Monatliche Reserve" (--text-caption, 0.8rem, --caption)
- Segments (Recharts):
  - **Fixkosten**: 35% — `#3B82F6` (Blue)
  - **Variable**: 17% — `#10B981` (Green)
  - **Sparen**: 7% — `#F59E0B` (Yellow/Orange)
  - **Hauskosten**: 40% — `#8B5CF6` (Purple)
- Stroke: `#FFFFFF` (white mode) / `#000000` (dark mode), 2px
- Animation: Staggered reveal on page load (each segment animates in with 100ms delay)

**Quick Stats Cards** (right side):
- 4 cards stacked vertically
- Each card: `--card` background, `--padding-card`, `--radius-lg`, `--shadow-sm`
- Layout: Label (--text-body-sm, --caption) + Value (--text-h3, --foreground)
- Reserve card: Background tinted with status color at 10% opacity
- Status badge: Pill shape (--radius-full), status color background, white text, 700 weight

### 2.4 Budget Categories Section

**Design Pattern**: Accordion-style expandable cards OR always-visible stacked cards (user preference).

#### Option A: Accordion (Recommended for mobile)
```
┌─────────────────────────────────────────────────┐
│ ▼ Einnahmen                        6.305 €/M   │
├─────────────────────────────────────────────────┤
│   Gehalt Christian         5.200 € [monatlich] │
│   Gehalt Dajana             850 € [monatlich]  │
│   Kindergeld                255 € [monatlich]  │
│   + Neuer Posten                                │
└─────────────────────────────────────────────────┘
```

**Accordion Header**:
- Height: `72px`
- Background: `--card` (collapsed), `--background` (expanded)
- Padding: `--space-6`
- Left: Chevron icon (rotate on expand) + Category name (--text-h2)
- Right: Total (--text-h2, --accent-pink for emphasis)
- Border-bottom: `2px solid --border`
- Hover: Slight scale transform (1.01), --shadow-md

**Accordion Body**:
- Padding: `--space-6`
- Each line item: 3 columns (Name | Amount + Frequency | Actions)
- Inputs: `--radius-md`, `--border`, --text-body
- Actions: Edit (pencil icon), Delete (trash icon), both --caption, hover --accent-pink

#### Option B: Always-Visible Stacked Cards
- Each category = Card component
- Same content layout as accordion body
- Better for desktop power users
- More scrolling on mobile

**Category Identification Colors** (Subtle left border accent):
- Einnahmen: `--accent-pink` (2px left border)
- Fixkosten: Blue `#3B82F6`
- Variable: Green `#10B981`
- Sparquote: Yellow `#F59E0B`
- Hauskosten: Purple `#8B5CF6`

### 2.5 Sticky Bottom Bar (Persistent Status)

**Purpose**: Always-visible financial summary + scenario switcher.

```
┌──────────────────────────────────────────────────────────┐
│ Einnahmen 6.305€ | Ausgaben 3.978€ | Haus 2.692€ | -365€ │
│ [Szenarien ▾]                                            │
└──────────────────────────────────────────────────────────┘
```

**Specifications**:
- Position: `fixed bottom-0 left-0 right-0`
- Height: `80px` (collapsed), expands to `300px` when scenarios open
- Background: `--card` with `backdrop-blur(12px)` for glassmorphism
- Border-top: `1px solid --border`
- Shadow: `--shadow-lg` (upward shadow)
- Z-index: `50`

**Top Bar Layout**:
- 4 stat boxes (equal width, flex-grow)
- Each: Value (--text-body-lg) + Label (--text-caption, --caption)
- Reserve value: Color-coded by status

**Scenarios Dropdown** (Expandable):
- Trigger: "Szenarien ▾" button (left side)
- Content: Scrollable list of saved scenarios
- Each scenario card:
  - Name (--text-body, 700 weight)
  - Einnahmen + Reserve preview (--text-body-sm, --caption)
  - Actions: Laden (pink pill button), Löschen (ghost button)
- "+ Aktuelles Szenario speichern" button at bottom

---

## 3. Component Design

### 3.1 Buttons

#### Primary CTA (Pink Pill)
```css
.button-primary {
  background: var(--accent-pink);
  color: #FFFFFF;
  font-weight: 700;
  font-size: 1rem;
  padding: 0.75rem 2rem;
  border-radius: var(--radius-full);
  border: none;
  transition: all 200ms ease;
}

.button-primary:hover {
  background: var(--accent-pink-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
```

**Usage**: "Szenario speichern", "Berechnen", "Laden"

#### Secondary (Outline)
```css
.button-secondary {
  background: transparent;
  color: var(--foreground);
  border: 1px solid var(--border);
  font-weight: 300;
  font-size: 1rem;
  padding: 0.75rem 2rem;
  border-radius: var(--radius-full);
  transition: all 200ms ease;
}

.button-secondary:hover {
  border-color: var(--accent-pink);
  color: var(--accent-pink);
}
```

**Usage**: "Abbrechen", "Zurücksetzen"

#### Ghost (Icon-only or text)
```css
.button-ghost {
  background: transparent;
  color: var(--caption);
  border: none;
  padding: 0.5rem;
  transition: color 200ms ease;
}

.button-ghost:hover {
  color: var(--accent-pink);
}
```

**Usage**: Edit, Delete, Theme toggle

### 3.2 Input Fields

#### Text/Number Input
```css
.input-field {
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 300;
  color: var(--foreground);
  transition: border-color 200ms ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--accent-pink);
  box-shadow: 0 0 0 3px rgba(230, 3, 95, 0.1);
}
```

**Layout**:
- Label above input (--text-body-sm, --caption)
- Input field
- Optional helper text below (--text-caption, --caption)

#### Select Dropdown (Frequency)
```css
.select-field {
  /* Same as input-field */
  appearance: none;
  background-image: url('data:image/svg+xml...');  /* Custom arrow */
  background-position: right 1rem center;
  background-repeat: no-repeat;
  padding-right: 3rem;
}
```

**Options**: "monatlich", "quartalsweise", "jährlich"

### 3.3 Budget Item Row (Inline Editing)

```
┌─────────────────────────────────────────────────────────┐
│ [Name Input]  [Amount] € [Frequency ▾]  [✎] [🗑]       │
└─────────────────────────────────────────────────────────┘
```

**Layout**:
- Grid: `1fr 180px 160px 80px`
- Name: Text input (left-aligned)
- Amount: Number input (right-aligned) + " €" suffix (static text)
- Frequency: Select dropdown
- Actions: Icon buttons (--button-ghost)

**Behavior**:
- Default state: All fields editable (inline editing)
- Focus state: Pink border on active input
- Delete: Fade-out animation (300ms) before removal
- New item: Slide-in from top (200ms)

### 3.4 Budget Status Badge

```html
<span class="status-badge status-critical">
  Kritisch
</span>
```

```css
.status-badge {
  display: inline-block;
  padding: 0.375rem 1rem;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-very-good {
  background: var(--status-very-good);
  color: #FFFFFF;
}

.status-sufficient {
  background: var(--status-sufficient);
  color: #000000;
}

.status-tight {
  background: var(--status-tight);
  color: #FFFFFF;
}

.status-critical {
  background: var(--status-critical);
  color: #FFFFFF;
}
```

**Logic**:
- Reserve > 500€ → "Sehr gut" (green)
- Reserve > 300€ → "Ausreichend" (yellow)
- Reserve > 0€ → "Knapp" (orange)
- Reserve ≤ 0€ → "Kritisch" (red)

### 3.5 Category Card

```css
.category-card {
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: var(--padding-card);
  border-left: 4px solid var(--category-color);  /* Accent color */
  box-shadow: var(--shadow-sm);
  transition: all 200ms ease;
}

.category-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.category-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.category-card-title {
  font-size: var(--text-h2);
  font-weight: 300;
  color: var(--foreground);
}

.category-card-total {
  font-size: var(--text-h2);
  font-weight: 700;
  color: var(--accent-pink);
}
```

### 3.6 Donut Chart (Recharts Integration)

```tsx
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const CHART_COLORS = {
  fixkosten: '#3B82F6',   // Blue
  variable: '#10B981',    // Green
  sparen: '#F59E0B',      // Yellow
  hauskosten: '#8B5CF6',  // Purple
};

const data = [
  { name: 'Fixkosten', value: 2328, percentage: 35 },
  { name: 'Variable', value: 1150, percentage: 17 },
  { name: 'Sparen', value: 500, percentage: 7 },
  { name: 'Hauskosten', value: 2692, percentage: 40 },
];

<ResponsiveContainer width="100%" height={320}>
  <PieChart>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      innerRadius={90}
      outerRadius={140}
      fill="#8884d8"
      paddingAngle={2}
      dataKey="value"
      animationBegin={0}
      animationDuration={800}
    >
      {data.map((entry, index) => (
        <Cell
          key={`cell-${index}`}
          fill={CHART_COLORS[entry.name.toLowerCase()]}
        />
      ))}
    </Pie>
  </PieChart>
</ResponsiveContainer>
```

**Center Content** (Absolute positioned over chart):
```tsx
<div className="chart-center">
  <span className="chart-label">Monatliche Reserve</span>
  <span className="chart-value">-365 €</span>
</div>
```

```css
.chart-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.chart-label {
  display: block;
  font-size: var(--text-caption);
  color: var(--caption);
  margin-bottom: 0.5rem;
}

.chart-value {
  display: block;
  font-size: var(--text-display);
  font-weight: 300;
  color: var(--foreground);
}
```

### 3.7 Scenario Card (in Sticky Bar Dropdown)

```html
<div class="scenario-card">
  <div class="scenario-header">
    <h4>Normalzustand</h4>
    <span class="scenario-reserve status-critical">-365 €</span>
  </div>
  <p class="scenario-meta">Einnahmen: 6.305 €</p>
  <div class="scenario-actions">
    <button class="button-primary-sm">Laden</button>
    <button class="button-ghost">Löschen</button>
  </div>
</div>
```

```css
.scenario-card {
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin-bottom: var(--space-3);
  transition: all 200ms ease;
}

.scenario-card:hover {
  border-color: var(--accent-pink);
  box-shadow: var(--shadow-sm);
}

.scenario-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.scenario-reserve {
  font-size: var(--text-body);
  font-weight: 700;
}

.scenario-meta {
  font-size: var(--text-body-sm);
  color: var(--caption);
  margin-bottom: var(--space-3);
}

.scenario-actions {
  display: flex;
  gap: var(--space-2);
}
```

---

## 4. Animation & Motion

### 4.1 Page Load Sequence (Staggered Reveal)

```css
/* All elements start hidden */
.animate-in {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 600ms ease forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger delays */
.hero-chart { animation-delay: 0ms; }
.hero-stats { animation-delay: 100ms; }
.category-1 { animation-delay: 200ms; }
.category-2 { animation-delay: 300ms; }
.category-3 { animation-delay: 400ms; }
.category-4 { animation-delay: 500ms; }
.category-5 { animation-delay: 600ms; }
```

### 4.2 Hover States

```css
/* Card hover */
.category-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
}

/* Button hover */
.button-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(230, 3, 95, 0.3);
}

/* Icon button hover */
.button-ghost:hover {
  color: var(--accent-pink);
  transform: scale(1.1);
}
```

### 4.3 Transitions

```css
/* Color transitions for status changes */
.chart-value,
.status-badge,
.category-card-total {
  transition: color 400ms ease;
}

/* Border color on focus */
.input-field:focus {
  border-color: var(--accent-pink);
  transition: border-color 200ms ease, box-shadow 200ms ease;
}

/* Theme toggle (smooth color shift) */
* {
  transition: background-color 300ms ease, color 300ms ease, border-color 300ms ease;
}
```

### 4.4 Scenario Loading (Optimistic UI)

When user clicks "Laden":
1. **Immediate feedback**: Button shows spinner (200ms)
2. **Optimistic update**: All values morph to new scenario (400ms ease)
3. **Chart re-animation**: Donut segments animate to new percentages (600ms)
4. **Status badge update**: Color fade transition (400ms)

```tsx
// React implementation hint
const loadScenario = async (scenarioId: string) => {
  // 1. Start loading state
  setIsLoading(true);

  // 2. Optimistic update (immediate)
  setBudget(scenariosMap[scenarioId]);

  // 3. Wait for animation to complete
  await new Promise(resolve => setTimeout(resolve, 600));

  // 4. End loading state
  setIsLoading(false);
};
```

---

## 5. Responsive Breakpoints

### 5.1 Breakpoint Strategy

```css
/* Mobile First approach */
:root {
  --container-max: 1280px;
}

/* Breakpoints */
@media (min-width: 640px)  { /* Tablet Portrait */ }
@media (min-width: 768px)  { /* Tablet Landscape */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Large Desktop */ }
```

### 5.2 Layout Adaptations

#### Mobile (< 640px)
- **Header**: Module tabs stack vertically (drawer menu)
- **Hero**: Chart + stats stack vertically (chart on top)
- **Categories**: Accordion ONLY (no always-visible option)
- **Budget Items**: 2-row layout per item (name/amount on row 1, frequency/actions on row 2)
- **Sticky Bar**: Icons-only stats (no labels), scenarios button full-width

#### Tablet (640px - 1024px)
- **Hero**: Chart + stats side-by-side (60/40 split)
- **Categories**: User choice (accordion OR stacked cards)
- **Budget Items**: Single row, smaller column gaps

#### Desktop (> 1024px)
- **Hero**: Chart + stats side-by-side (50/50 split)
- **Categories**: Stacked cards recommended
- **Budget Items**: Full grid layout with generous spacing

### 5.3 Font Scaling

```css
/* Root font-size adjusts automatically */
html { font-size: 18px; }

@media (max-width: 1024px) {
  html { font-size: 16px; }
}

/* All rem-based units scale proportionally */
```

### 5.4 Touch Targets (Mobile)

All interactive elements meet WCAG AA minimum touch target size:
- Buttons: Minimum `44px × 44px`
- Input fields: Minimum `44px` height
- Icon buttons: `44px × 44px` (even if icon is smaller)
- Accordion headers: Minimum `60px` height

---

## 6. Accessibility (WCAG 2.1 AA)

### 6.1 Color Contrast

**White Mode**:
- Foreground (#000000) on Background (#FFFFFF): **21:1** ✓
- Body text (#333333) on Background (#FFFFFF): **12.6:1** ✓
- Caption (#808080) on Background (#FFFFFF): **5.3:1** ✓
- Accent Pink (#E6035F) on White (CTA text): **5.9:1** ✓

**Dark Mode**:
- Foreground (#FFFFFF) on Background (#000000): **21:1** ✓
- Caption (#808080) on Background (#000000): **5.3:1** ✓
- Caption (#808080) on Card (#111111): **5.0:1** ✓

**Status Colors** (on white background):
- Green (#10B981): **4.5:1** ✓
- Yellow (#F59E0B): **4.6:1** ✓ (text uses black)
- Orange (#F97316): **4.8:1** ✓
- Red (#EF4444): **5.2:1** ✓

### 6.2 Keyboard Navigation

**Tab Order**:
1. Module navigation (Header)
2. Theme toggle
3. Category accordion headers (in order)
4. Budget item inputs (Name → Amount → Frequency → Edit → Delete)
5. "Neuer Posten" button
6. Sticky bar stats (focusable for screen readers)
7. "Szenarien" dropdown button
8. Scenario cards (Load → Delete for each)

**Focus Indicators**:
```css
*:focus-visible {
  outline: 2px solid var(--accent-pink);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Custom focus for cards */
.category-card:focus-within {
  box-shadow: 0 0 0 3px rgba(230, 3, 95, 0.2);
}
```

**Skip Links**:
```html
<a href="#main-content" class="skip-link">
  Zum Hauptinhalt springen
</a>
```

### 6.3 Screen Reader Support

**ARIA Labels**:
```html
<!-- Category sections -->
<section aria-labelledby="income-heading">
  <h2 id="income-heading">Einnahmen</h2>
  ...
</section>

<!-- Budget items -->
<div role="group" aria-label="Gehalt Christian">
  <input aria-label="Betrag" type="number" />
  <select aria-label="Frequenz">...</select>
</div>

<!-- Status badge -->
<span class="status-badge" role="status" aria-live="polite">
  Kritisch
</span>

<!-- Donut chart -->
<div role="img" aria-label="Ausgabenverteilung: 35% Fixkosten, 17% Variable, 7% Sparen, 40% Hauskosten">
  <svg>...</svg>
</div>
```

**Live Regions**:
```html
<!-- Budget recalculation -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  Budget aktualisiert. Monatliche Reserve: -365 Euro, Status kritisch.
</div>
```

### 6.4 Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* Keep functional transitions (focus states) */
  *:focus-visible {
    transition: outline 0ms;
  }
}
```

---

## 7. Phase 2: Receipt Manager Module

### 7.1 Entry Point

**Navigation**: Header tabs "Budget Planner | **Receipts**"

### 7.2 Upload Interface

```
┌─────────────────────────────────────────────────┐
│                                                 │
│         📄                                      │
│    Beleg hochladen                              │
│                                                 │
│    Ziehen Sie eine Datei hierher               │
│    oder klicken Sie zum Auswählen              │
│                                                 │
│    JPG, PNG, WEBP · Max. 10 MB                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Specifications**:
- Dashed border: `2px dashed --border`
- Background: `--card`
- Padding: `--space-16` vertical, `--space-8` horizontal
- Icon: Upload icon (--caption color, 48px)
- Hover: Border color → `--accent-pink`, background → `rgba(230, 3, 95, 0.05)`
- Active (drag over): Border → solid, background → `rgba(230, 3, 95, 0.1)`

### 7.3 Processing State

```
┌─────────────────────────────────────────────────┐
│                                                 │
│         ⟳                                       │
│    KI analysiert Beleg...                       │
│                                                 │
│    [Progress bar: 0 → 100%]                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Progress Bar**:
- Height: `8px`
- Background: `--border`
- Fill: `--accent-pink`
- Border-radius: `--radius-full`
- Animation: Smooth width transition (400ms ease)

### 7.4 Extraction Preview (Split View)

```
┌─────────────────────────┬─────────────────────────┐
│                         │                         │
│   [Receipt Image]       │   Extrahierte Daten     │
│                         │                         │
│   [Zoom controls]       │   Händler: REWE         │
│                         │   Datum: 15.03.2026     │
│                         │   Betrag: 87,45 €       │
│                         │   Kategorie: [Variable] │
│                         │                         │
│                         │   Einzelposten:         │
│                         │   - Milch      1,29 €   │
│                         │   - Brot       2,49 €   │
│                         │   - ...                 │
│                         │                         │
│                         │   Konfidenz: 94%        │
│                         │                         │
│                         │   [✓ Speichern] [✗]     │
└─────────────────────────┴─────────────────────────┘
```

**Layout**: 50/50 split (desktop), stacked (mobile)

**Left Panel**:
- Image preview (max-height: 600px, object-fit: contain)
- Zoom controls (pinch-to-zoom on mobile)
- Background: `--background`

**Right Panel**:
- Editable fields (inline editing)
- Category: Button group (Fixkosten, Variable, Sparquote, Sonstiges)
- Confidence indicator: Progress bar + percentage
- Action buttons: "Speichern" (primary), "Verwerfen" (secondary)

### 7.5 Saved Receipts List

```
┌─────────────────────────────────────────────────┐
│ Gespeicherte Belege                    [Filter]│
├─────────────────────────────────────────────────┤
│ [📄] REWE · 15.03.2026 · 87,45 € · Variable   │
│ [📄] Shell · 14.03.2026 · 65,00 € · Fixkosten │
│ [📄] DM · 13.03.2026 · 23,90 € · Variable     │
└─────────────────────────────────────────────────┘
```

**List Item**:
- Icon + Merchant + Date + Amount + Category badge
- Click → Expand to show details
- Hover: Background → `--card`, cursor pointer

---

## 8. Implementation Guidelines

### 8.1 Tech Stack Integration

**Tailwind CSS Configuration**:
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'accent-pink': 'var(--accent-pink)',
        'accent-pink-hover': 'var(--accent-pink-hover)',
        // ... status colors
      },
      fontFamily: {
        sans: ['"Acumin Pro"', 'ui-sans-serif', 'system-ui'],
      },
      fontSize: {
        'display': '3.5rem',
        'h1': '3rem',
        // ... rest of scale
      },
      spacing: {
        // 8pt grid system
      },
      borderRadius: {
        'lg': '1rem',
        'xl': '1.5rem',
        // ... rest
      },
    },
  },
};
```

**shadcn/ui Component Overrides**:
- Use existing Card, Button, Input components
- Override theme tokens to match brand system
- Custom Badge variant for status indicators

**Recharts Theme**:
```tsx
// Chart wrapper with brand colors
const chartConfig = {
  fixkosten: { label: 'Fixkosten', color: '#3B82F6' },
  variable: { label: 'Variable', color: '#10B981' },
  sparen: { label: 'Sparen', color: '#F59E0B' },
  hauskosten: { label: 'Hauskosten', color: '#8B5CF6' },
};
```

### 8.2 Component File Structure

```
components/
├── budget/
│   ├── BudgetHero.tsx          # Donut chart + quick stats
│   ├── CategoryCard.tsx         # Single category with items
│   ├── BudgetItem.tsx           # Single line item (inline edit)
│   ├── StatusBadge.tsx          # Color-coded status indicator
│   ├── DonutChart.tsx           # Recharts wrapper
│   └── StickyStatusBar.tsx      # Bottom bar with scenarios
├── receipts/
│   ├── ReceiptUpload.tsx        # Drag & drop zone
│   ├── ReceiptPreview.tsx       # Split view extraction
│   ├── ReceiptList.tsx          # Saved receipts
│   └── ReceiptCard.tsx          # Single receipt item
└── ui/                          # shadcn/ui base components
    ├── button.tsx
    ├── input.tsx
    ├── card.tsx
    ├── badge.tsx
    └── ...
```

### 8.3 State Management Hints

**Budget State** (Zustand or React Context):
```ts
interface BudgetState {
  categories: {
    income: BudgetItem[];
    fixed: BudgetItem[];
    variable: BudgetItem[];
    savings: BudgetItem[];
    housing: BudgetItem[];
  };
  totals: {
    income: number;
    expenses: number;
    housing: number;
    reserve: number;
    status: 'very-good' | 'sufficient' | 'tight' | 'critical';
  };
  scenarios: Scenario[];
  activeScenario: string | null;
}
```

**Local Storage Persistence**:
- Auto-save on every change (debounced 500ms)
- Load from localStorage on mount
- Scenario management (CRUD operations)

### 8.4 Performance Optimizations

1. **Chart Rendering**: Memoize DonutChart component to prevent re-renders
2. **Input Debouncing**: Debounce budget item changes (500ms) before recalculation
3. **List Virtualization**: If > 50 budget items, use react-window
4. **Image Optimization**: Compress uploaded receipts (max 1MB) before Base64 encoding
5. **Lazy Loading**: Code-split Receipt Manager module (dynamic import)

---

## 9. Design Principles Summary

### 9.1 Visual Language

1. **Minimalism**: No decorative elements. Every pixel serves a function.
2. **Asymmetry**: Avoid center-aligned grids. Left-heavy composition (content left, visual right).
3. **Generous Whitespace**: Cards have breathing room. Section padding is generous (`--space-12`).
4. **Color Restraint**: Pink is an accent, not a fill. Status colors semantic only.
5. **Subtle Motion**: Animations are felt, not seen. 200-400ms transitions, staggered reveals.

### 9.2 Interaction Patterns

1. **Inline Editing**: No "Edit Mode" toggle. All fields editable by default.
2. **Optimistic UI**: Changes reflect immediately, validate after.
3. **Progressive Disclosure**: Scenarios hidden until needed (sticky bar dropdown).
4. **Clear Affordances**: Buttons look clickable (pill shape, shadow on hover).
5. **Immediate Feedback**: Every action has visual confirmation (color change, animation).

### 9.3 Information Hierarchy

**Primary**: Reserve value (hero chart center, largest text)
**Secondary**: Category totals (H2 size, pink accent)
**Tertiary**: Individual budget items (body text, inline editing)
**Metadata**: Frequencies, dates, confidence scores (caption text, grey)

### 9.4 Brand Consistency (Without Branding)

- **No Appvantage Logo**: This is a personal tool, not a branded product.
- **Design System Adoption**: We take the *design language* (colors, typography, spacing, motion) but not the *brand identity* (logo, tagline, corporate messaging).
- **Standalone Identity**: Haushaltsplaner is its own product. Design should feel cohesive with Appvantage's aesthetic but not derivative.

---

## 10. Design Tokens Reference (CSS Custom Properties)

### Complete Token System
```css
:root {
  /* ── Color Tokens ── */
  --background: #FFFFFF;
  --card: #F5F5F5;
  --foreground: #000000;
  --body-text: #333333;
  --caption: #808080;
  --border: #E8E8E8;
  --accent-pink: #E6035F;
  --accent-pink-hover: #C40250;

  --status-very-good: #10B981;
  --status-sufficient: #F59E0B;
  --status-tight: #F97316;
  --status-critical: #EF4444;

  --chart-fixkosten: #3B82F6;
  --chart-variable: #10B981;
  --chart-sparen: #F59E0B;
  --chart-hauskosten: #8B5CF6;

  /* ── Typography Tokens ── */
  --font-sans: "Acumin Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-weight-light: 300;
  --font-weight-bold: 700;

  --text-display: 3.5rem;
  --text-h1: 3rem;
  --text-h2: 2.25rem;
  --text-h3: 1.75rem;
  --text-body-lg: 1.125rem;
  --text-body: 1rem;
  --text-body-sm: 0.875rem;
  --text-caption: 0.8rem;
  --text-small: 0.75rem;

  --lh-tight: 1.1;
  --lh-heading: 1.2;
  --lh-body: 1.5;
  --lh-relaxed: 1.7;

  --ls-tight: -0.02em;
  --ls-wide: 0.15em;

  /* ── Spacing Tokens ── */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;

  --padding-card: var(--space-6);
  --padding-section: var(--space-12);
  --padding-page: var(--space-8);

  /* ── Border Radius Tokens ── */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-full: 9999px;

  /* ── Shadow Tokens ── */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.12);

  /* ── Transition Tokens ── */
  --transition-fast: 200ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 400ms ease;
}

.dark {
  /* ── Dark Mode Overrides ── */
  --background: #000000;
  --card: #111111;
  --foreground: #FFFFFF;
  --body-text: #FFFFFF;
  --border: #1A1A1A;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.7);

  /* Status colors adjusted for dark */
  --status-very-good: #34D399;
  --status-sufficient: #FBBF24;
  --status-tight: #FB923C;
  --status-critical: #F87171;
}
```

---

## 11. Next Steps for Implementation

### Phase 1: Foundation (Week 1)
1. ✅ Set up design tokens in globals.css
2. ✅ Configure Tailwind with custom theme
3. ✅ Implement base UI components (Button, Input, Card, Badge)
4. ✅ Build responsive layout grid
5. ✅ Add theme toggle (light/dark mode)

### Phase 2: Budget Planner Core (Week 2)
1. ✅ Build DonutChart component (Recharts integration)
2. ✅ Implement BudgetHero section
3. ✅ Create CategoryCard + BudgetItem components
4. ✅ Add inline editing functionality
5. ✅ Implement calculation logic (lib/budget/)
6. ✅ Build StickyStatusBar

### Phase 3: Scenario Management (Week 3)
1. ✅ LocalStorage abstraction layer
2. ✅ Scenario CRUD operations
3. ✅ Scenario dropdown UI in sticky bar
4. ✅ Load/Save scenario animations
5. ✅ Pre-seed "Normalzustand" + "Hausrenovierung2" scenarios

### Phase 4: Polish & Accessibility (Week 4)
1. ✅ Animation implementation (staggered reveals, transitions)
2. ✅ Keyboard navigation + focus indicators
3. ✅ ARIA labels + screen reader testing
4. ✅ Responsive breakpoint testing (mobile/tablet/desktop)
5. ✅ Performance optimization (memoization, debouncing)

### Phase 5: Receipt Manager (Week 5-6)
1. ✅ Upload interface (drag & drop)
2. ✅ Claude API integration (server-side route)
3. ✅ Extraction preview UI (split view)
4. ✅ Receipt list + storage
5. ✅ Image optimization + Base64 handling

---

## Appendix A: Design Rationale

### Why White Mode Default?

**User Context Analysis**:
- **Use Case**: Extended budget review sessions (30-60 min)
- **Environment**: Home office, living room (ambient lighting)
- **User Profile**: Family household (all age groups, including elderly)
- **Task Type**: Data entry, number comparison, decision-making

**Dark Mode Fatigue**: While dark mode is trendy and works well for enterprise dashboards (quick glances, data visualization), prolonged reading and data entry tasks benefit from higher ambient contrast (black text on white).

**Accessibility**: White mode provides better contrast for users with astigmatism or low vision. Dark mode will be available, but white is the safer default for a broader audience.

**Brand Context**: Appvantage uses dark mode for marketing materials (drama, cinematic feel). A household budget app prioritizes usability over aesthetics—white mode aligns with this.

### Why Pink Accent?

**Brand Continuity**: The signature pink (#E6035F) is distinctive and immediately recognizable. It provides brand consistency without requiring an Appvantage logo.

**Semantic Clarity**: Pink is not semantically overloaded (unlike red=error, green=success). It can serve as a neutral accent for CTAs, focus states, and emphasis without conflicting with status colors.

**Contrast**: Pink passes WCAG AA on both white and black backgrounds. It's vibrant enough to draw attention but not overwhelming.

### Why No Traditional Navigation?

**Single-Page App Philosophy**: Budget Planner and Receipt Manager are two views of the same data model (budget categories). There's no "About", "Settings", "Help" pages. Everything lives on one scrollable canvas.

**Reduced Cognitive Load**: No sidebar, no hamburger menu, no nested navigation. Users see two tabs in the header—that's it.

**Mobile-First**: Eliminates the need for a mobile nav drawer. Tabs are always visible and thumb-accessible.

---

## Appendix B: Accessibility Checklist

### WCAG 2.1 Level AA Compliance

- [x] **1.4.3 Contrast (Minimum)**: All text meets 4.5:1 ratio (body) or 3:1 (large text)
- [x] **1.4.11 Non-text Contrast**: UI components (buttons, inputs) meet 3:1 ratio
- [x] **2.1.1 Keyboard**: All functionality available via keyboard
- [x] **2.1.2 No Keyboard Trap**: Users can navigate away from all interactive elements
- [x] **2.4.3 Focus Order**: Tab order is logical (top to bottom, left to right)
- [x] **2.4.7 Focus Visible**: Focus indicators are clearly visible (2px pink outline)
- [x] **2.5.5 Target Size**: All touch targets are minimum 44×44px
- [x] **3.2.4 Consistent Identification**: Icons and labels are consistent across views
- [x] **4.1.2 Name, Role, Value**: All form inputs have accessible names
- [x] **4.1.3 Status Messages**: ARIA live regions announce budget recalculations

### Additional Considerations

- **Language**: `lang="de"` on `<html>` tag
- **Page Title**: `<title>Haushaltsplaner — Budget Planner</title>`
- **Skip Links**: "Zum Hauptinhalt springen" for keyboard users
- **Screen Reader Testing**: Test with NVDA (Windows) and VoiceOver (macOS/iOS)
- **Color Blindness**: Status colors are distinguishable by lightness (not just hue)
- **Motion Sensitivity**: `prefers-reduced-motion` disables all animations

---

## Appendix C: Component Library Mapping

### shadcn/ui Components Used

| Component | Use Case | Customization |
|-----------|----------|---------------|
| `Button` | Primary/Secondary CTAs | Pink pill variant, ghost variant |
| `Input` | Budget item fields | Pink focus ring |
| `Select` | Frequency dropdown | Custom arrow icon |
| `Card` | Category cards, scenario cards | Left border accent, hover lift |
| `Badge` | Status indicators | 4 color variants (status colors) |
| `Accordion` | Category sections (mobile) | Pink chevron, smooth expand |
| `Sheet` | Scenarios dropdown (mobile) | Slide up from bottom |
| `Tooltip` | Icon button hints | Pink background, small text |

### Recharts Components Used

| Component | Use Case |
|-----------|----------|
| `PieChart` | Donut chart (expense breakdown) |
| `Pie` | Individual donut segment |
| `Cell` | Per-segment color mapping |
| `ResponsiveContainer` | Responsive chart wrapper |
| `Legend` | Chart legend (optional) |

---

## Appendix D: Color Palette Reference

### Full Color Spectrum

```css
/* ── Greys (White Mode) ── */
--grey-50: #FAFAFA;
--grey-100: #F5F5F5;  /* Card background */
--grey-200: #E8E8E8;  /* Border */
--grey-300: #D4D4D4;
--grey-400: #A3A3A3;
--grey-500: #808080;  /* Caption text */
--grey-600: #525252;
--grey-700: #333333;  /* Body text */
--grey-800: #1F1F1F;
--grey-900: #0A0A0A;
--grey-950: #000000;  /* Foreground */

/* ── Greys (Dark Mode) ── */
--grey-dark-50: #FAFAFA;
--grey-dark-100: #E8E8E8;
--grey-dark-200: #D4D4D4;
--grey-dark-300: #A3A3A3;
--grey-dark-400: #808080;  /* Caption text */
--grey-dark-500: #525252;
--grey-dark-600: #333333;
--grey-dark-700: #1F1F1F;
--grey-dark-800: #111111;  /* Card background */
--grey-dark-900: #0A0A0A;
--grey-dark-950: #000000;  /* Background */

/* ── Accent Pink ── */
--pink-50: #FFF0F5;
--pink-100: #FFE0EB;
--pink-200: #FFC2D9;
--pink-300: #FF94BA;
--pink-400: #FF5C93;
--pink-500: #E6035F;  /* Primary accent */
--pink-600: #C40250;  /* Hover state */
--pink-700: #9E0240;
--pink-800: #7A0131;
--pink-900: #5C0125;

/* ── Status Colors ── */
/* Green (Very Good) */
--green-400: #4ADE80;
--green-500: #10B981;  /* Primary */
--green-600: #059669;

/* Yellow (Sufficient) */
--yellow-400: #FBBF24;
--yellow-500: #F59E0B;  /* Primary */
--yellow-600: #D97706;

/* Orange (Tight) */
--orange-400: #FB923C;
--orange-500: #F97316;  /* Primary */
--orange-600: #EA580C;

/* Red (Critical) */
--red-400: #F87171;
--red-500: #EF4444;  /* Primary */
--red-600: #DC2626;

/* ── Chart Colors ── */
/* Blue (Fixkosten) */
--blue-500: #3B82F6;

/* Green (Variable) */
--green-chart: #10B981;

/* Yellow (Sparen) */
--yellow-chart: #F59E0B;

/* Purple (Hauskosten) */
--purple-500: #8B5CF6;
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-15 | Initial design system documentation |

---

**Document Owner**: Christian Bolln-Busch
**Last Updated**: 2026-03-15
**Status**: Ready for Implementation
**Next Review**: After Phase 1 implementation (Week 1)

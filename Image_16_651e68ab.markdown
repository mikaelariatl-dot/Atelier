---
name: Atelier Curated Commerce
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#303030'
  inverse-on-surface: '#f2f0f0'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#625e56'
  on-secondary: '#ffffff'
  secondary-container: '#e9e2d7'
  on-secondary-container: '#68645c'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#370e00'
  on-tertiary-container: '#c06e4c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e9e2d7'
  secondary-fixed-dim: '#ccc6bc'
  on-secondary-fixed: '#1e1b15'
  on-secondary-fixed-variant: '#4a463f'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb598'
  on-tertiary-fixed: '#370e00'
  on-tertiary-fixed-variant: '#753416'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  display-hero:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '500'
    lineHeight: 44px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.06em
  metric-number:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 2rem
  margin-sm: 1rem
  margin-lg: 3.5rem
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4.5rem
---

## Brand & Style

This design system embodies an editorial luxury experience tailored for high-touch personal shopping (Jastip) and bespoke inventory orchestration. It bridges the intimacy of an exclusive concierge service with the operational rigor of a private commerce suite.

### Target Audience & Emotional Impact
- **Client Facing:** Discerning collectors and luxury shoppers seeking elusive, curated acquisitions from global fashion capitals. The UI must project discretion, absolute authenticity, and white-glove attentiveness.
- **Owner Suite:** An autonomous boutique curator who manages multi-currency procurement, luggage logistics, proof-of-purchase records, and client fulfillment on the fly. The workspace must evoke calm competence, spatial order, and effortless clarity.

### Design Movement: Warm Tactile Minimalism & Editorial Modern
The aesthetic diverges from sterile SaaS monochrome by employing tactile warmth: sun-bleached linen whites, warm parchment tones, and grounding charcoal. Depth is rendered via micro-hairline contours and diffused, warm-tinted ambient glows rather than blunt dropped shadows. High-contrast typography pairs classical haute-couture editorial display titles with surgical sans-serif data displays.

## Colors

The palette is rooted in tactile organic luxury, evoking unbleached cotton dustbags, bespoke tissue wraps, and architectural gallery floors. It intentionally rejects clinical blues and synthetic purples in favor of earth-informed, functional neutrals and botanical status pigments.

### Functional Palette Mapping
- **Canvas Base (`#FAF9F5`):** Warm Ivory. Main viewport canvas for public storefront and backend workspace, eliminating display glare and establishing a relaxed luxury baseline.
- **Surface Elevation (`#F3EFEA`):** Soft Warm Cream. Used for nested containers, metric cards, procurement drawers, and structural cards.
- **Structural Lines & Outlines (`#E6DFD5`):** Sand Beige. Fine hairline rules (1px) defining grid limits, list rows, and field parameters without optical noise.
- **Primary Text & High Action (`#1A1A1A`):** Dark Charcoal. The dominant visual anchor for primary buttons, total sums, and high-impact headlines. Never pure black (`#000000`).
- **Secondary Text & Metadata (`#4A4A4A`):** Muted Slate. Used for supporting specs, batch codes, secondary navigation, and micro-labels.

### Status & Lifecycle Accents
- **Verified / Settled / In-Hand:** `#2A5A44` (Deep Atelier Emerald). Signifies authentic items verified, payments cleared, and customs duties processed.
- **Pending / In-Transit / Deposit:** `#B88728` (Antique Amber Gold). Represents pending customs, buyer deposits awaiting confirmation, and international tracking updates.
- **Alert / Scarcity / Critical Action:** `#C2704E` (Warm Terracotta). Flagging low stock limits, flight departure cutoffs, and client address mismatches.

## Typography

The typographic architecture balances romantic, editorial poise with high-density data utility:

- **Headlines & Editorial Statements (`Playfair Display`):** Reserved for lookbook collections, narrative product titles, and high-level dashboard section introductions. It signals curation, human discernment, and luxury heritage.
- **Operational Interface & Numerics (`Plus Jakarta Sans`):** Drives all functional UI, interactive triggers, input forms, ledger tables, currency tickers, and status labels. Its clean geometry retains maximum legibility under rapid data scanning while feeling softer than engineering-focused fonts.
- **Tabular Data Rules:** In procurement ledgers and financial summary cards, numbers must utilize tabular lining figures (`font-variant-numeric: tabular-nums`) to ensure vertical decimal alignment across multi-currency columns.
- **Label Formatting:** All uppercase labels (`label-md`) require subtle letter spacing (0.04em to 0.06em) to prevent condensed ink trapping on warm-tinted backgrounds.

## Layout & Spacing

The layout is structured around an editorial fluid grid system with expansive breathing room, prioritizing clarity of transaction over visual clutter.

### Grid & Canvas Structure
- **Desktop (1280px and above):** 12-column dynamic grid, 2rem (32px) gutters, and 3.5rem (56px) outer margins. The owner's management suite adopts an asymmetrical split: a 280px fixed structural navigation rail paired with a fluid 12-column operational canvas.
- **Tablet (768px - 1279px):** 8-column layout, 1.5rem (24px) gutters, 2rem (32px) canvas margins. Complex management tables compress into responsive composite cards or horizontally scrollable unified panels.
- **Mobile (Below 768px):** 4-column layout, 1rem (16px) gutters, 1rem (16px) canvas margins. Bottom navigation sheets and full-width card containers replace side-by-side splits.

### Spatial Rhythm
- **Micro Spacing (`space-2xs` to `space-sm`):** Reserved for badge paddings, tag icon separations, and label-to-input vertical offsets.
- **Component Spacing (`space-md` to `space-lg`):** Dictates interior padding for metric tiles, order summary modules, and interactive list cells.
- **Structural Spacing (`space-xl` to `space-3xl`):** Governs vertical rhythm between catalog showcases, order timeline phases, and private concierge communication threads.

## Elevation & Depth

Visual hierarchy is communicated through tactile tonal layering combined with hair-thin borders and warm, diffused ambient light. Avoid stark drop shadows or sharp drop projections.

### Surface Tiers
- **Tier 0 (Canvas Base):** Warm Ivory (`#FAF9F5`). The infinite base background.
- **Tier 1 (Resting Container):** Soft Warm Cream (`#F3EFEA`) coupled with a 1px solid hairline border in Sand Beige (`#E6DFD5`). Used for data panels, product cards, and dashboard metrics.
- **Tier 2 (Interactive Floating):** White pure ivory (`#FFFFFF`) with a subtle warm shadow: `0 8px 24px -4px rgba(42, 36, 28, 0.06), 0 2px 6px -1px rgba(42, 36, 28, 0.04)`. Used for dropdown selections, hovering cards, active flight-manifest popovers, and sticky sub-navigation.
- **Tier 3 (Overlay / Modal / Drawer):** Elevated Warm Cream (`#FAF9F5`) wrapped with 1px Sand Beige (`#E6DFD5`) and bounded by a deep diffused veil: `0 20px 48px -8px rgba(26, 26, 26, 0.12)`. Applied to procurement slip uploads, client inquiry drawers, and checkout sheets.

### Border Principles
All interior division lines (table rows, tab bars, panel splits) must be rendered as 1px hairline borders using Sand Beige (`#E6DFD5`). This preserves architectural structure while retaining a gentle, paper-like presence.

## Shapes

The design system maintains a refined, approachable geometry utilizing soft organic curves that feel like hand-cut stationery.

### Geometric Hierarchy
- **Standard UI Elements (`0.5rem` / `8px`):** Input fields, inline filter selectors, table action tags, and status badges.
- **Component Enclosures (`1rem` / `16px` - `rounded-lg`):** Metric overview cards, product media tiles, batch item list items, and summary widgets.
- **Large Panels & Modals (`1.5rem` / `24px` - `rounded-xl`):** Flyout drawers, receipt inspection viewports, checkout panels, and full-screen dialogs.
- **Capsule / Pill Shapes (`9999px`):** Primary action call-to-actions, category filter pills, client VIP tags, and currency toggles.

## Components

### Buttons & Triggers
- **Primary Action:** Solid Dark Charcoal (`#1A1A1A`) background, Warm Ivory (`#FAF9F5`) text. Pill-shaped (`rounded-full`), height of 44px (touch-compliant), padding 0 24px. Subtle lift on hover with `rgba(26, 26, 26, 0.04)` overlay.
- **Secondary Action:** Transparent base, 1px solid hairline in Sand Beige (`#E6DFD5`), Dark Charcoal (`#1A1A1A`) text. On hover, fills with Soft Warm Cream (`#F3EFEA`).
- **Destructive / Cautionary:** Sand Beige hairline border with Warm Terracotta (`#C2704E`) text; hovers to a low-opacity terracotta wash (`rgba(194, 112, 78, 0.08)`).

### Metric Cards (Owner Suite)
- Framed in `rounded-xl` containers featuring Soft Warm Cream (`#F3EFEA`) backgrounds and 1px Sand Beige (`#E6DFD5`) perimeter borders.
- Top section holds a small uppercase label (`label-md`) in Muted Slate (`#4A4A4A`) paired with a subtle context icon.
- Central value displayed in bold `metric-number` (`#1A1A1A`), followed by a compact trend pill indicating margin efficiency or delivery countdowns.

### Status Pills & Badges
- Pill-shaped (`rounded-full`), height 24px, horizontal padding of 10px, typography set to `label-md`.
- **Verified / Settled:** Background `rgba(42, 90, 68, 0.08)`, text `#2A5A44`, 1px border `rgba(42, 90, 68, 0.20)`.
- **In-Transit / Pending Verification:** Background `rgba(184, 135, 40, 0.10)`, text `#8C651B`, 1px border `rgba(184, 135, 40, 0.25)`.
- **Customs Hold / Urgent:** Background `rgba(194, 112, 78, 0.10)`, text `#A54B2A`, 1px border `rgba(194, 112, 78, 0.25)`.

### Input Fields & Selectors
- Height: 46px. Background: `#FFFFFF` or `#FAF9F5`. Border: 1px hairline in `#E6DFD5`. Radius: `rounded-md` (8px).
- Typography: `body-md` in `#1A1A1A`. Placeholder text in Muted Slate at 50% opacity.
- Focus State: 1.5px border transition to `#1A1A1A` without harsh outer glow halos.

### Data Tables (Private Inventory & Client Requests)
- Column headers styled with `label-md`, uppercase, rendered in Muted Slate (`#4A4A4A`), padded with 12px 16px, bottom border 1px solid `#E6DFD5`.
- Alternating subtle hover states (`#F5F1EB`) rather than striped rows, retaining a calm gallery-like view.
- Currency, weights, and dates styled using `font-variant-numeric: tabular-nums`.

### Curated Product & Sourcing Cards
- Border-radius `rounded-xl`, composed of a 4:5 aspect ratio image wrapper framed with an inset 1px hairline border to keep luxury product photography grounding against warm cream backdrops.
- Floating translucent tag at top-left denoting the origin city (e.g., "PARIS", "TOKYO") in `label-md`.
- Price and client allotment counts placed immediately below in high-contrast charcoal and muted slate.
# Design System: Voice Studio (Master)

**Style:** Micro-interactions (Tactile, responsive, subtle animations)
**Typography Pattern:** Elegant Professional (Display: Playfair Display / Sans: Source Sans 3)

## Color Palette (Mantine ↔ Tailwind Mapping)

| Brand Family | Role | Mantine Key | Tailwind Class | Base Hex |
|--------------|------|-------------|----------------|----------|
| **Forest** | Primary / Text | `forest.9` | `text-forest-900` | `#2d3a31` |
| **Sage** | Secondary / Border | `sage.6` | `bg-sage-600` | `#8c9a84` |
| **Terracotta** | Accent / Highlight | `terracotta.7` | `bg-terracotta-700` | `#c27b66` |
| **Wave** | Functional Alt | `wave.5` | `bg-wave-500` | `#00adad` |
| **Studio** | Primary Action | `studio.5` | `bg-studio-500` | `#3a6aff` |
| **On-Air Red** | Recording / Alert | `on-air-red.5`| `bg-on-air-red-500` | `#ff3d2e` |
| **Brand Dark** | Headings | `brand-dark.7` | `text-brand-dark-700` | `#2d3534` |

## Spacing & Radius
- **Base Grid:** 8px
- **Interactive Radius:** `xl` (32px / Pill)
- **Container Radius:** `3xl` (24px)
- **Small Radius:** `md` (8px)

## Typography Scale
- **H1:** 48px / 1.1 line-height (Playfair Display)
- **H2:** 36px / 1.2 line-height (Playfair Display)
- **Body:** 16px / 1.5 line-height (Source Sans 3)
- **Small:** 14px (Source Sans 3)

## UX Guidelines
- `duration-timing`: 150-300ms for micro-interactions.
- `tap-feedback-speed`: Response within 100ms.
- `color-accessible-pairs`: 4.5:1 ratio minimum for body text.
- `number-tabular`: Monospaced figures for timers/meters.

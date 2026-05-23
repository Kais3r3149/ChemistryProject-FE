# Design System

## Color Strategy

Restrained. One primary accent (Slate Blue) carries actions, selection, and state. Severity colors (emerald/amber/red) are semantic-only, never decorative.

## Palette

### Primary — Slate Blue

| Token | OKLCH | Usage |
|---|---|---|
| `primary-50` | `oklch(0.97 0.012 243)` | Hover backgrounds, tinted surfaces |
| `primary-100` | `oklch(0.93 0.025 243)` | Active backgrounds |
| `primary-200` | `oklch(0.86 0.045 243)` | Selection highlight |
| `primary-300` | `oklch(0.75 0.065 243)` | Decorative borders |
| `primary-400` | `oklch(0.62 0.075 243)` | Icons on dark bg, dark mode links |
| `primary-500` | `oklch(0.52 0.082 243)` | Primary buttons |
| `primary-600` | `oklch(0.44 0.078 243)` | Links, focus ring |
| `primary-700` | `oklch(0.36 0.068 243)` | Pressed state |
| `primary-800` | `oklch(0.28 0.052 243)` | Text on tinted bg |
| `primary-900` | `oklch(0.21 0.038 243)` | Dark headings on colored bg |
| `primary-950` | `oklch(0.14 0.022 243)` | Deepest dark |

### Semantic severity (unchanged — these are data, not brand)

| Role | Color | Usage |
|---|---|---|
| Minor / Safe | Emerald | Low-severity interactions |
| Moderate / Warning | Amber | Medium-severity interactions |
| Major / Danger | Red | High-severity interactions |

### Neutrals

Slate scale (`#f8fafc` → `#0f172a`). Background slightly tinted toward the blue axis to stay temperature-consistent with the primary.

## Typography

- **Family**: Inter (loaded via next/font)
- **Scale**: 12 / 13 / 14 / 16 / 18 / 24 / 30 / 36px
- **Body line-length**: max 65ch in prose contexts
- **Weight contrast**: 400 (body) / 600 (labels, UI) / 700 (headings)

## Spacing & Radius

- Base unit: 4px
- Card radius: `0.75rem` (lg)
- Button radius: `0.5rem` (md)
- Input radius: `0.5rem` (md)

## Motion

- Default transition: 150–200ms ease-out
- Fade-in-up: 0.6s ease-out (page loads)
- No bounce, no elastic, no orchestrated sequences

## Component notes

- `.text-gradient` — solid `oklch(0.44 0.078 243)` (ban on gradient text upheld)
- `.glow-primary` — subtle slate blue shadow, not green
- `.bg-mesh` — very low-chroma slate tints, not solid color
- Severity badges: full-border hairline (not side-stripe), tinted background

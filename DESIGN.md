# Design Brief

## Direction

МебелМенаџер — Industrial furniture manufacturing management system with data-dense interface, dark theme, and 3D cargo visualization.

## Tone

Brutalist minimalism with industrial precision — maximum clarity, no decoration, inspired by Vercel + Linear.

## Differentiation

Emergency order badges glow in warm amber; 3D canvas uses ultra-dark background (L=0.12) to make geometry pop; tabs use weight shifts instead of fill.

## Color Palette

| Token       | Light OKLCH   | Dark OKLCH    | Role                                   |
| ----------- | ------------- | ------------- | -------------------------------------- |
| background  | 0.99 0 0      | 0.12 0 0      | Page background (near-black in dark)   |
| foreground  | 0.15 0 0      | 0.92 0 0      | Primary text                           |
| card        | 1.0 0 0       | 0.16 0 0      | Surface layers, tables                 |
| primary     | 0.35 0 0      | 0.75 0.15 190 | Cyan interactive elements, highlights  |
| accent      | 0.35 0 0      | 0.75 0.18 45  | Warm amber for emergency flags         |
| muted       | 0.95 0 0      | 0.22 0 0      | Secondary text, borders                |
| destructive | 0.55 0.22 25  | 0.55 0.22 25  | Error states                           |

## Typography

- Display: Space Grotesk — geometric, technical, section headings and tab labels
- Body: DM Sans — clean and dense, UI labels and data-heavy content
- Mono: JetBrains Mono — part numbers, metrics, order IDs
- Scale: hero `text-3xl md:text-4xl font-bold`, h2 `text-2xl font-bold`, label `text-xs font-semibold uppercase`, body `text-sm`

## Elevation & Depth

Flat aesthetic with minimal shadows; depth created through background layering (ultra-dark background, slightly lighter card surface) and borders instead of elevation.

## Structural Zones

| Zone    | Treatment                                    | Border                      | Notes                         |
| ------- | -------------------------------------------- | --------------------------- | ----------------------------- |
| Header  | card background (0.16), strong contrast      | border-b `border-border/40` | Logo, user, logout            |
| Content | background (0.12), alternating card sections | subtle dividers             | Tab navigation, data tables   |
| 3D View | background ultra-dark (0.12)                 | none                        | Cargo canvas, full depth      |
| Footer  | card background (0.16)                       | border-t `border-border/40` | Status, metadata (if present) |

## Spacing & Rhythm

Compact horizontal density (12-16px gaps in tables); generous vertical breathing between sections (24-32px). Micro-spacing: 4px padding on data cells, 8px on buttons.

## Component Patterns

- Buttons: primary `bg-primary text-primary-foreground`, hover `opacity-80`, no shadow
- Cards: `bg-card`, minimal roundness (4-6px), no shadow, `border border-border/20`
- Badges: emergency `.badge-emergency` — amber background, border, small text
- Tabs: active `.tab-active` (bold, cyan bottom border), inactive `.tab-inactive` (normal weight, transparent border)

## Motion

- Entrance: tabs slide-in over 200ms on page load
- Hover: button opacity shift (80%) on hover, instant
- Decorative: none; functional transitions only

## Constraints

- DARK MODE ONLY — no light mode
- Minimal radii — 4-8px on cards, 6px on buttons
- No drop shadows; depth via layers and borders
- Font display only in Macedonian
- Emergency orders always flagged with badge

## Signature Detail

Ultra-dark background (0.12 L) with warm amber accent badges for emergency orders creates professional, high-contrast UI that prioritizes data clarity and visual urgency in one cohesive move.

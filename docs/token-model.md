# Token Model (Outline)

## ThemeConfig Shape
- `name`, `mode` (`"light-dark"`), typed color/typography/spacing/radius/shadow sections.

## Colors
- Primary: `500`, `600`; Neutral: `50`, `900`; optional `danger.500`.
- Surface: `background`, `foreground`, `card`.
- CSS vars: `--color-primary-500`, `--color-neutral-50`, etc.

## Typography
- `fontFamily`, `baseFontSizePx`.
- Scale: `sm`, `base`, `lg`, `xl` each with `sizeRem` and `lineHeight`.
- CSS vars: `--text-sm-size`, `--text-sm-line`, etc.

## Spacing
- `spacing: Record<string, string>`; CSS vars `--space-<key>`.
- Utility classes: `.p-<key>`, `.m-<key>`, `.gap-<key>`, plus axis variants.

## Radius & Shadow
- Records keyed by string; CSS vars `--radius-<key>`, `--shadow-<key>`.
- Utilities: `.rounded-<key>`, `.shadow-<key>`.

## Files Emitted
- `tokens.css`, `utilities.css`, `components.css`, `index.css` (imports in order).

## Theming Behavior
- Light tokens on `:root`; dark overrides on `[data-theme="dark"]` (future extension).

# Design Decisions (Outline)

## Architecture
- Single-page app with no framework; modular TS folders: `app/` (state, UI, preview, export) and `compiler/` (types, compile, emitters).
- Pure functions for compiler; side effects isolated in app layer.

## State & Data Flow
- Central `ThemeConfig` state object; typed; updates via small intent functions.
- Debounced recompile on state change; preview iframe receives compiled CSS string.

## UI & UX
- Split layout: controls vs. preview; export actions grouped.
- Keyboard navigation and ARIA labels for all controls.
- Color inputs paired with hex text fields for accessibility.

## Compiler Rules
- Deterministic file ordering: `tokens.css`, `utilities.css`, `components.css`, `index.css`.
- Token naming matches CSS custom properties; no external deps in output.

## Preview Strategy
- Iframe isolation; write concatenated CSS into `<style>` tag; set `data-theme` on `documentElement`.

## Exports
- Download `theme.config.json`.
- Zip `css-bundle.zip` with the four CSS files.

## Testing & Quality
- ESLint + Prettier; strict TS compiler options.
- Unit tests planned for compiler emitters; manual smoke for UI.

## Performance
- Minimal dependencies; debounce compile; avoid layout thrash in preview.

## Open Questions
- Dark mode token strategy (v1) and danger palette defaults.

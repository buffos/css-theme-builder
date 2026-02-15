# Changelog

All notable changes to this project will be documented in this file. We will log every step as we build the UI Theme Generator in small, focused increments.

## [0.0.0] - 2026-02-01

### Added

- Initial changelog created to track incremental progress.

## [0.1.0] - 2026-02-02

### Added

- Installed linting and formatting toolchain (ESLint with TypeScript/import plugins, Prettier, eslint-config-prettier).
- Configuration files for ESLint and Prettier added.
- Added @types/node to support Node globals in tooling configs.

## [0.2.0] - 2026-02-02

### Added

- README skeleton covering purpose, tech stack, scripts, goals, and contribution notes.
- Documentation outlines created: `docs/design-decisions.md` and `docs/token-model.md`.

## [0.3.0] - 2026-02-02

### Added

- Initial app shell in `src/main.ts` with structure for header, controls, preview placeholder, and export actions.
- Starter layout and theming styles in `src/style.css` for readability and responsive split layout.

## [0.4.0] - 2026-02-02

### Added

- Compiler registry and extensibility types in `src/compiler/types.ts`.
- Shared state now consumes the central `ThemeConfig` from compiler types to avoid drift (`src/app/state.ts`).

## [0.5.0] - 2026-02-02

### Added

- Preview module (`src/app/preview.ts`) with iframe placeholder and state subscription.
- Main entry now mounts the preview host in `src/main.ts`.

## [0.5.1] - 2026-02-02

### Added

- Styling for preview host and iframe container in `src/style.css`.

## [0.6.0] - 2026-02-02

### Added

- Controls registry scaffolding and name control stub (`src/app/registry.ts`, `src/app/ui.ts`) mounted from `src/main.ts`.
- Styles for control groups and inputs in `src/style.css`.
- Design decision note on iframe lifecycle updated earlier (v0.5.0).

## [0.7.0] - 2026-02-02

### Added

- Compiler stub (`src/compiler/compile.ts`) returning placeholder CSS files.
- Preview now consumes compile output for iframe content.

## [0.7.1] - 2026-02-02

### Added

- Skeleton emitters for tokens, utilities, and components (`src/compiler/emit-*.ts`) and `compile` now delegates to them.

## [0.8.0] - 2026-02-02

### Added

- Introduced plugin structure: `plugins/basic-colors` and `plugins/basic-theme-name` control module.
- Controls registry now pulls controls from plugins; compiler registry uses the colors plugin.

## [0.9.0] - 2026-02-02

### Added

- Split remaining sections into plugins: surface, spacing, radius, shadow, typography; each provides compiler entry and controls stub.
- Compiler and controls registries now fully plugin-driven for these sections.

## [0.9.1] - 2026-02-02

### Changed

- Removed legacy compiler emit helper files in favor of plugin-based emitters.
- `compile` now skips empty emitter outputs to avoid blank CSS chunks.

## [0.10.0] - 2026-02-02

### Added

- Colors plugin now supports palette modes (manual, analogous, complementary, triadic) with auto-generated swatches and manual overrides; UI wired to state.

### Changed

- Refactored HSL conversion helpers for readability and documented parameters.

## [0.10.1] - 2026-02-02

### Added

- Components plugin emitting base component styles (buttons, inputs, card, alert, table, modal) and wired into compiler registry.

## [0.11.0] - 2026-02-02

### Changed

- Split components into individual plugins (buttons, inputs, card, alert, table, modal) and wired each into the compiler registry; removed the single monolithic components plugin.

## [0.11.1] - 2026-02-02

### Added

- Placeholder controls for component plugins (buttons, inputs, card, alert, table, modal) registered in the controls registry.

## [0.11.2] - 2026-02-02

### Changed

- ESLint config now allows unused variables prefixed with `_` (for plugin isEnabled signatures, etc.).

## [0.11.3] - 2026-02-02

### Added

- Preview registry now aggregates per-plugin preview modules (buttons, inputs, card, alert, table, modal) and renders them as accordions in the iframe.

### Changed

- Components preview is decentralized; plugins supply their own preview snippets.

## [0.11.4] - 2026-02-02

### Changed

- Controls panel now renders each plugin inside an accordion; preview shows only accordions that are open, via preview setActive filter.

## [0.11.5] - 2026-02-02

### Changed

- Enforced single-open behavior for control accordions; preview filters to the active accordion.
- Added per-plugin preview modules (decentralized) and typed preview handling.
- Lint cleanup for array types in main.

## [0.11.6] - 2026-02-02

### Changed

- Restyled control accordions (bordered cards, custom arrow indicator, improved spacing).

## [0.12.0] - 2026-02-02

### Added

- Export helpers to download `theme.config.json` and `css-bundle.zip` (fflate).
- Hooked footer buttons to export actions in `main.ts`.

## [0.12.1] - 2026-02-02

### Fixed

- Cleaned export zip typing and lint issues; payload now uses `Zippable` and Blob creation is typed.

## [0.12.2] - 2026-02-02

### Changed

- Initial theme config now assembled from per-plugin defaults (colors, surface, typography, spacing, radius, shadow, components), removing centralized defaults file.

## [0.12.3] - 2026-02-02

### Changed

- Enabled export buttons with proper hover/active styles; disabled state now only applies when the button is actually disabled.

## [0.12.4] - 2026-02-02

### Changed

- Danger color in generated palettes now forces a red hue (fixed ~0°) while keeping base saturation/lightness, preventing greenish danger tones.

## [0.12.5] - 2026-02-02

### Added

- Export/footer status messaging for downloads and load failures; visible, screen-reader-friendly status text.

## [0.12.6] - 2026-02-02

### Added

- Toast notifications for export/load success and errors; styled and animated for quick feedback.

## [0.12.7] - 2026-02-02

### Changed

- Colors plugin now emits on-color tokens (on-primary, on-danger, on-surface) using luminance to pick readable text colors.
- Buttons primary text and alert text now use on-color tokens for better contrast.

## [0.12.8] - 2026-02-02

### Added

- Success and warning palettes with on-color tokens emitted; defaults set to green and amber tones.

## [0.12.9] - 2026-02-03

### Added

- Success and warning swatches exposed in the Colors control; palette inputs now sit in a compact grid with the mode selector on its own line.
- `buildThemeConfig` helper composes initial config from plugin defaults instead of a hardcoded object.

### Changed

- Select elements now match input styling (padding, font, dark chrome) for consistency.
- Plugin type augmentation avoids a fixed `ThemeModules` shape, keeping the system fully plugin-driven.

## [0.13.0] - 2026-02-04

### Added

- Full Dark Mode Integration:
  - Updated compiler to support `emitDarkTokens` for plugins.
  - Added theme mode selector in the app header (Auto, Light, Dark).
  - Surface and Colors plugins now emit dark mode overrides using `@media (prefers-color-scheme: dark)` and `[data-theme='dark']`.
  - Preview iframe now respects the selected theme mode via `data-theme` attribute.
  - Updated surface defaults to provide a clean light mode and the signature "Aurora" dark mode.

## [0.14.0] - 2026-02-05

### Added

- Comprehensive Unit Testing Suite:
  - Installed Vitest as the core testing framework.
  - Implemented unit tests for the central compiler to verify light/dark/auto mode CSS emission.
  - Added specialized test suites for `Colors`, `Surface`, and `Typography` plugins to ensure correct token and utility generation.
  - Wired `npm test` script for CI/CD readiness.

## [0.15.0] - 2026-02-06

### Added

- Typography Scale Presets:
  - Added "Scale Mode" toggle (Manual vs. Modular) to the Typography panel.
  - Implemented automated modular scale calculation with predefined ratios (Golden Ratio, Perfect Fourth, etc.).
  - Added logic to auto-calculate `sm`, `lg`, and `xl` sizes based on the `base` size and selected ratio.
  - New test suite for modular scale math accuracy.

## [0.16.0] - 2026-02-07

### Added

- Spacing Scale Generator:
  - Added "Scale Mode" (Manual vs. Generated) and "Base Unit (px)" controls to the Spacing panel.
  - Implemented automated scale generation (0, 0.5, 1, 2, 4, 8, etc.) based on the base unit.
  - Updated utility emission to handle decimal steps (e.g., `.p-0_5`).
  - New test suite for spacing scale logic.

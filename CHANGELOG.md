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

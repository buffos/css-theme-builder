# Changelog

All notable changes to this project will be documented in this file. We will log every step as we build the UI Theme Generator in small, focused increments.

## [0.35.0] - 2026-02-15

### Added

- **Color Scale Overhaul**: Implemented full 50-950 ramps (11 steps) for all palettes using a new `generateScale` utility.
- **Dedicated Accent Palettes**: Introduced independent Secondary and Tertiary color systems, decoupling them from the Primary scale.
- **Enhanced Palette Generation**: Refactored Analogous, Complementary, and Triadic modes to intelligently distribute colors across the new accent scales.
- **Responsive Layout Tokens**: Introduced a new `basic-layout` plugin to manage global responsive breakpoints, container widths, and gutter sizes.
- **Motion & Animation System**: Implemented a dedicated `basic-motion` plugin with global duration and easing tokens, integrated across all components for smooth, consistent transitions.
- **Custom HTML Sandbox**: Added a new sandbox plugin allowing users to test their current theme against custom markup with real-time feedback.
- **Theme Presets (Personas)**: Introduced a library of "One-Click Personas" (Midnight Pro, Cyberpunk, Corporate Clean, Minimalist) for rapid theme experimentation.
- **Dev Handoff: Copy to Clipboard**: Added one-click copy functionality to the Style Guide, allowing users to instantly copy design tokens as CSS variables.

### Changed

- **Style Guide Expansion**: Updated the technical specification to visualize the complete 50-950 color ramps and include layout/responsive token specs.
- **Improved Semantic Hues**: Redesigned status color logic to maintain accessibility while inheriting thematic saturation.

## [0.34.0] - 2026-02-15

### Added

- **Auto-Generated Style Guide**: A new developer-focused preview module that provides a technical specification of the entire design system.
  - Detailed Typography spec with CSS variable names and sizes.
  - Full Color System visualization including Primary, Neutral, and Semantic scales.
  - Technical foundations overview for Spacing, Radii, and Shadows.
- **Improved Preview Registry**: Standardized the registration of preview modules to allow for tiered documentation (Overview vs. Technical Spec).

## [0.33.0] - 2026-02-15

### Added

- **Card Background & Border overrides**: Added color pickers and "Reset" buttons to revert to theme defaults.
- **Modal Border Color**: Added color picker and "Reset" button for modal borders.
- **Improved Alert visibility**: Implemented dynamic high-contrast status text colors using `color-mix`, fixing contrast issues in both light and dark themes.
- **Robust State Management**: Implemented granular input tracking in Card and Modal plugins to prevent unintentional override "pollution" when adjusting other controls.

### Changed

- **Refined Card controls**: Converted text inputs to intuitive sliders (Padding, Border weight) and token-based dropdowns (Radius, Shadow).
- **Standardized Box Model**: Applied `box-sizing: border-box` to Cards and Modals to ensure padding is calculated correctly on all sides.

### Fixed

- Fixed Modal padding bug where padding was only applied vertically; it now applies correctly to all sides.
- Fixed Card override bug where border color was unintentionally affecting the background color.
- Refined Modal layout with standardized section headers and improved preview responsiveness.

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

## [0.17.0] - 2026-02-08

### Added

- Per-Component Token Overrides:
  - Redesigned `Buttons` and `Card` components to use internal CSS variables that default to theme tokens.
  - Added "Overrides" section to the Buttons panel (Background, Text, Radius, Border).
  - Added "Overrides" section to the Card panel (Background, Radius, Padding, Border, Shadow).
  - Implemented unit tests for component-level override propagation.

## [0.18.0] - 2026-02-09

### Added

- Interactive Component States:
  - Added `.hover`, `.active`, and `.focus` classes to `Buttons` and `Inputs` for static visualization.
  - Expanded `Buttons` preview to show a full grid of states for both default and primary variations.
  - Expanded `Inputs` preview to show Vertical alignment of Normal, Focus, and Error states.
  - Added `.card--interactive` class with hover elevation and updated `Card` preview to show interactive variations.

## [0.19.0] - 2026-02-10

### Added

- Google Fonts Integration:
  - Added a curated list of popular Google Fonts in `fonts.ts`.
  - Implemented dynamic `@import` emission in the Typography compiler.
  - Added a searchable font picker (datalist) to the Typography panel.
  - Refactored `basic-typography` plugin to improve type safety and reduce cognitive complexity.

## [0.20.0] - 2026-02-11

### Added

- Real-Time Accessibility Checks:
  - Created `utils/colors.ts` with WCAG 2.1 contrast and luminance calculation helpers.
  - Added live contrast badges (AAA/AA/Fail) to the Colors panel.
  - Badges update instantly during color picking or palette generation.
  - Refactored `basic-colors` plugin to use shared utilities and reduced cognitive complexity.

## [0.21.0] - 2026-02-12

### Added

- Responsive Layout Preview:
  - Added a viewport switcher toolbar to the Live Preview panel.
  - Implemented dynamic iframe resizing for Mobile (375px), Tablet (768px), and Desktop (100%).
  - Added centering and polished background for the preview viewport.

## [0.22.0] - 2026-02-13

### Added

- Local Version History:
  - Implemented Undo/Redo history stacks (max 50 states) in the state manager.
  - Added `localStorage` persistence to auto-save and restore theme configurations.
  - Added Undo/Redo buttons to the app header with keyboard shortcuts (Ctrl+Z, Ctrl+Y).
  - Consolidated state management logic and fixed multiple lint warnings.

## [0.23.0] - 2026-02-14

### Added

- Radius Plugin UI:
  - Replaced placeholder sidebar controls with functional sliders for `sm`, `md`, and `lg` radii.
  - Added "Radii Gallery" preview module to visualize corner rounding levels.
  - Updated default radius keys from numeric to descriptive tokens.

## [0.24.0] - 2026-02-15

### Added

- Shadow Plugin UI:
  - Replaced placeholder controls with a multi-slider shadow editor (X, Y, Blur, Spread, Opacity).
  - Added "Shadows Gallery" preview module to visualize elevation levels.
  - Refactored shadow keys to semantic `sm`, `md`, and `lg` tokens.

## [0.25.0] - 2026-02-15

### Added

- Surface Plugin UI:
  - Replaced placeholder controls with color pickers for Light and Dark modes.
  - Added controls for `Background`, `Foreground`, and `Card` surfaces for both themes.
  - Added "Surfaces Gallery" preview module to demonstrate layout depth and contrast.

## [0.26.0] - 2026-02-15

### Added

- Advanced Alert Controls:
  - Added sliders for `Padding` and `Border Weight` customization.
  - Implemented dynamic corner radius selection linked to global theme tokens.
  - Enhanced compiler to emit status variants: `.alert--success`, `.alert--warning`, `.alert--danger`, and `.alert--info`.
  - Added multi-variant preview gallery using `color-mix` for sophisticated status backgrounds.

## [0.27.0] - 2026-02-15

### Added

- Advanced Modal Controls:
  - Added sliders for Backdrop Blur and Backdrop Opacity.
  - Added layout controls for Modal Padding, Border Weight, and Max Width.
  - Implemented dynamic corner radius selection for modals.
  - Enhanced preview with a simulated backdrop and background content for better visualization.

## [0.28.0] - 2026-02-15

### Added

- Advanced Table Controls:
  - Added sliders for Horizontal and Vertical cell padding.
  - Added control for cell border weight.
  - Implemented Row Striping toggle with automatic theme-aware contrast.
  - Implemented Hover Effect toggle for table rows.
  - Enhanced preview module with realistic data to showcase density and striping.

## [0.29.0] - 2026-02-15

### Added

- Design System Overview Dashboard:
  - Created a new summary preview module that aggregates all design tokens.
  - Added visual swatches for the Color Palette.
  - Added Typography scale demonstration.
  - Added visual representations of Spacing and Radius scales.
  - Added Elevation and Depth section showcasing all shadow levels.
  - Integrated the dashboard as the primary view in the preview panel.

## [0.31.0] - 2026-02-15

### Added

- Persistent Palette Modes: The Colors plugin now saves and restores the selected generation mode (Analogous, Complementary, Triadic, Manual) in the theme configuration.
- Absolute Semantic Hues: Refactored status color generation to pin specific hues (Red for Danger, Green for Success, Orange for Warning) while maintaining thematic saturation/lightness.
- Role Indicators: Added a 4-dot status indicator to the Color Usage Matrix for rapid visual validation of core semantic roles.

### Fixed

- Resolved architectural circular dependency between the global state manager and plugin preview modules by implementing a configuration-injection pattern.
- Fixed a bug where "Danger" colors would lose their semantic meaning (turning green) when using a green primary base.

## [0.30.0] - 2026-02-15

### Changed

- Refined Typography system: expanded scale to include `2xl` and `3xl`, and standardized line-height variable names (`--text-*-line-height`).
- Improved Font Family selector UX: implemented "Smart Reveal" behavior (auto-clear on focus, auto-restore on blur) and auto-blur after selection.
- Restored architectural integrity by moving plugin-specific migration logic out of the core state manager and into the Typography plugin.

### Fixed

- Resolved critical compiler bug where light-mode tokens were discarded when the app was set to "Always Dark" mode.
- Fixed configuration merging order in `buildThemeConfig` to ensure user settings correctly override plugin defaults.
- Fixed CSS `@import` invalidation by reordering the compiler registry to prioritize Typography (and its Google Font imports) at the top of the stylesheet.
- Fixed Typography preview regression where the `--font-family` variable was ignored by the iframe body.

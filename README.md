# UI Theme Generator (WIP)

Single-page, framework-free Vite + TypeScript app that lets users build a theme configuration JSON, live-preview it in an iframe, and generate/download CSS bundles in-browser.

## Status
- Tooling set up (ESLint + Prettier).
- App implementation not started; Vite scaffold still present.

## Tech Stack
- Vite + TypeScript (no UI framework)
- ESLint with `@typescript-eslint`, `eslint-plugin-import`
- Prettier for formatting

## Scripts
- `npm run dev` – start dev server
- `npm run build` – type-check then build
- `npm run preview` – preview production build
- `npm run lint` / `npm run lint:fix` – lint (optionally fix)
- `npm run format` – format with Prettier

## Goals (MVP)
- Theme controls (colors, typography, spacing, radius, shadow)
- Live preview in iframe
- Compile `theme.config.json` → CSS (`tokens`, `utilities`, `components`, `index`)
- Export JSON and zipped CSS bundle

## Contributing Notes
- One-file-at-a-time steps for clarity.
- Track every change in `CHANGELOG.md`.

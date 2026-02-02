import './style.css';
import { createPreview } from './app/preview';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('Root element #app not found');
}

root.innerHTML = `
  <main class="app-shell" aria-label="Theme generator">
    <header class="app-shell__header">
      <div>
        <p class="eyebrow">UI Theme Generator</p>
        <h1>Build and preview your theme</h1>
        <p class="lede">
          Define tokens, preview components, and export JSON plus a CSS bundle — all in-browser.
        </p>
      </div>
    </header>

    <section class="app-shell__body">
      <section class="panel panel--controls" aria-label="Theme controls">
        <h2>Theme Controls</h2>
        <p>Controls coming next.</p>
      </section>

      <section class="panel panel--preview" aria-label="Live preview">
        <h2>Live Preview</h2>
        <div class="preview-host" role="presentation"></div>
      </section>
    </section>

    <section class="app-shell__footer" aria-label="Export actions">
      <button type="button" disabled>Download theme.config.json</button>
      <button type="button" disabled>Download css-bundle.zip</button>
    </section>
  </main>
`;

const previewHost = document.querySelector<HTMLDivElement>('.preview-host');

if (!previewHost) {
  throw new Error('Preview host not found');
}

const preview = createPreview();
preview.mount(previewHost);

window.addEventListener('beforeunload', () => {
  preview.unmount();
});

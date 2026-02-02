import './style.css';
import { createPreview } from './app/preview';
import { getConfig, subscribe, updateConfig } from './app/state';
import { controlsRegistry } from './app/ui';

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
        <div class="controls-host"></div>
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
const controlsHost = document.querySelector<HTMLDivElement>('.controls-host');

if (!previewHost) {
  throw new Error('Preview host not found');
}

if (!controlsHost) {
  throw new Error('Controls host not found');
}

const preview = createPreview();
preview.mount(previewHost);

const controlApi = { getConfig, updateConfig, subscribe };
const controlCleanups: (() => void)[] = [];

// for all ui controls
Object.values(controlsRegistry).forEach((module) => {
  const container = document.createElement('div'); // create a div element for the control
  container.className = 'control-module';
  controlsHost.appendChild(container);
  module.mount(container, controlApi); // populate it
  if (module.unmount) {
    controlCleanups.push(module.unmount); // register unmount at the end.
  }
});

window.addEventListener('beforeunload', () => {
  preview.unmount();
  controlCleanups.forEach((cleanup) => cleanup()); // clean up event listeners before unload.
});

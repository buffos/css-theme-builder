import './style.css';
import { downloadCssBundle, downloadJson, loadConfigFromFile } from './app/export';
import { createPreview } from './app/preview';
import { getConfig, subscribe, updateConfig, undo, redo, subscribeHistory } from './app/state';
import { controlsRegistry } from './app/ui';
import type { ThemeMode } from './compiler/types';
import { nudgeContrast, generateScale } from './utils/colors';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('Root element #app not found');
}

root.innerHTML = `
  <main class="app-shell" aria-label="Theme generator">
    <header class="app-shell__header">
      <div class="header-content">
        <div>
          <p class="eyebrow">UI Theme Generator</p>
          <h1>Build and preview your theme</h1>
          <p class="lede">
            Define tokens, preview components, and export JSON plus a CSS bundle — all in-browser.
          </p>
        </div>
        <div class="header-actions">
          <div style="display: flex; align-items: center;">
            <div class="history-actions">
              <button type="button" class="history-btn" id="undo-btn" title="Undo (Ctrl+Z)" disabled>
                <span>Undo</span> <kbd>Ctrl+Z</kbd>
              </button>
              <button type="button" class="history-btn" id="redo-btn" title="Redo (Ctrl+Y)" disabled>
                <span>Redo</span> <kbd>Ctrl+Y</kbd>
              </button>
            </div>
            <div class="control-group" style="margin-bottom: 0;">
              <label for="theme-mode-select">Theme Mode</label>
              <select id="theme-mode-select">
                <option value="light-dark">Auto (Light-Dark)</option>
                <option value="light">Always Light</option>
                <option value="dark">Always Dark</option>
              </select>
            </div>
          </div>
        </div>
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
      <button type="button" data-action="download-json">Download theme.config.json</button>
      <button type="button" data-action="download-css">Download css-bundle.zip</button>
      <button type="button" data-action="load-json">Load theme.config.json</button>
      <div class="export-status" role="status" aria-live="polite"></div>
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

const controlApi = { 
  getConfig, 
  updateConfig, 
  subscribe,
  setActivePreview: (ids: string[]) => preview.setActive(ids),
};

declare global {
  var auditFix: (key: string, baseBg: string, targetFg: string) => void;
}

// Global Accessibility Fixer for Preview Modules
globalThis.auditFix = (key: string, baseBg: string, targetFg: string) => {
  const fixed = nudgeContrast(baseBg, targetFg);
  updateConfig(cfg => {
    const next = { ...cfg };
    if (!next.colors) return next;
    
    // If the key is a semantic scale, regenerate it
    if (key === 'primary') next.colors.primary = generateScale(fixed);
    else if (key === 'secondary') next.colors.secondary = generateScale(fixed);
    else if (key === 'tertiary') next.colors.tertiary = generateScale(fixed);
    else if (key === 'danger') next.colors.danger = generateScale(fixed);
    else if (key === 'success') next.colors.success = generateScale(fixed);
    else if (key === 'warning') next.colors.warning = generateScale(fixed);
    else if (key === 'neutral-900') next.colors.neutral = { ...next.colors.neutral, 900: fixed };
    else if (key === 'on-primary') next.colors.primary = generateScale(fixed); // Nudge background to fix on-color
    
    return next;
  });
};

const controlCleanups: (() => void)[] = [];
const openIds = new Set<string>();
const accordions: { details: HTMLDetailsElement; id: string }[] = [];

// Build accordion per control module (single-open behavior)
Object.values(controlsRegistry).forEach((module, index) => {
  const details = document.createElement('details');
  const isAudit = ['sandbox', 'accessibility', 'styleguide'].includes(module.id);
  details.className = isAudit ? 'control-accordion audit-accordion' : 'control-accordion';
  
  if (index === 0) details.open = true;
  const summary = document.createElement('summary');
  summary.textContent = module.title;
  const container = document.createElement('div');
  container.className = 'control-module';
  details.append(summary, container);
  controlsHost.appendChild(details);

  module.mount(container, controlApi);
  if (module.unmount) controlCleanups.push(module.unmount);

  if (details.open) openIds.add(module.id);

  accordions.push({ details, id: module.id });

  details.addEventListener('toggle', () => {
    if (details.open) {
      // close all others
      accordions.forEach((entry) => {
        if (entry.details !== details) entry.details.open = false;
      });
      openIds.clear();
      openIds.add(module.id);
    } else {
      openIds.delete(module.id);
    }
    preview.setActive([...openIds]);
  });
});

preview.setActive([...openIds]);

const modeSelect = document.querySelector<HTMLSelectElement>('#theme-mode-select');
if (modeSelect) {
  modeSelect.value = getConfig().mode;
  modeSelect.addEventListener('change', () => {
    updateConfig((cfg) => ({ ...cfg, mode: modeSelect.value as ThemeMode }));
  });
}

// History Controls
const undoBtn = document.querySelector<HTMLButtonElement>('#undo-btn');
const redoBtn = document.querySelector<HTMLButtonElement>('#redo-btn');

if (undoBtn && redoBtn) {
  undoBtn.addEventListener('click', () => undo());
  redoBtn.addEventListener('click', () => redo());

  subscribeHistory((canUndo, canRedo) => {
    undoBtn.disabled = !canUndo;
    redoBtn.disabled = !canRedo;
  });
}

globalThis.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'z') {
      if (e.shiftKey) redo();
      else undo();
      e.preventDefault();
    } else if (e.key === 'y') {
      redo();
      e.preventDefault();
    }
  }
});

globalThis.addEventListener('beforeunload', () => {
  preview.unmount();
  controlCleanups.forEach((cleanup) => cleanup()); // clean up event listeners before unload.
});

const jsonBtn = document.querySelector<HTMLButtonElement>('button[data-action="download-json"]');
const cssBtn = document.querySelector<HTMLButtonElement>('button[data-action="download-css"]');
const loadBtn = document.querySelector<HTMLButtonElement>('button[data-action="load-json"]');
const statusEl = document.querySelector<HTMLDivElement>('.export-status');
const toastRoot = document.body;

const setStatus = (message: string, tone: 'info' | 'error' = 'info') => {
  if (statusEl) {
    statusEl.textContent = message;
    statusEl.dataset.tone = tone;
  }
  showToast(tone === 'error' ? 'Error' : 'Success', message, tone);
};

const showToast = (title: string, message: string, tone: 'info' | 'error' = 'info') => {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.dataset.tone = tone;
  toast.innerHTML = `
    <div class="toast__title">${title}</div>
    <div class="toast__body">${message}</div>
  `;
  toastRoot.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);
};

jsonBtn?.addEventListener('click', () => {
  downloadJson();
  setStatus('Downloaded theme.config.json');
});

cssBtn?.addEventListener('click', () => {
  downloadCssBundle();
  setStatus('Downloaded css-bundle.zip');
});

loadBtn?.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (!file) return;
    loadConfigFromFile(file).catch((err) => {
      console.error(err);
      setStatus(err instanceof Error ? err.message : 'Failed to load config', 'error');
    });
  });
  input.click();
});

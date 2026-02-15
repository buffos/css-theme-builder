import { compile } from '../compiler/compile';

import { previewModules } from './preview-registry';
import type { PreviewModule } from './preview-registry';
import { getConfig, subscribe } from './state';

type PreviewHandles = {
  mount: (container: HTMLElement) => void;
  unmount: () => void;
  setActive: (ids: string[]) => void;
};

const createIframe = (): HTMLIFrameElement => {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('title', 'Theme preview');
  iframe.setAttribute('aria-live', 'polite');
  iframe.style.width = '100%';
  iframe.style.height = '420px';
  iframe.style.border = '1px solid #1f2c4f';
  iframe.style.borderRadius = '10px';
  iframe.style.background = '#0f1729';
  return iframe;
};

const writePreviewDocument = (
  iframe: HTMLIFrameElement,
  css: string,
  mode: string,
  modules = previewModules satisfies PreviewModule[]
): void => {
  const themeAttr = mode === 'dark' ? 'data-theme="dark"' : '';
  iframe.srcdoc = `
    <!doctype html>
    <html ${themeAttr}>
      <head>
        <style>
          :root { font-family: Inter, "Segoe UI", system-ui, -apple-system, sans-serif; }
          body {
            margin: 0;
            background: #0f1729;
            color: #e7ecff;
            padding: 16px;
            display: grid;
            gap: 16px;
          }
          .preview-accordion {
            border: 1px solid #2c3a63;
            border-radius: 8px;
            overflow: hidden;
            background: #0c1324;
          }
          .preview-accordion > summary {
            cursor: pointer;
            padding: 12px 14px;
            font-weight: 600;
            list-style: none;
          }
          .preview-accordion[open] > summary {
            border-bottom: 1px solid #1f2c4f;
          }
          .preview-pane {
            padding: 12px 14px;
          }
        </style>
        <style>${css}</style>
      </head>
      <body>
        ${modules
          .map(
            (mod: PreviewModule, index: number) => `
              <details class="preview-accordion"${index === 0 ? ' open' : ''}>
                <summary>${mod.title}</summary>
                <div class="preview-pane">${mod.render()}</div>
              </details>
            `
          )
          .join('\n')}
      </body>
    </html>
  `;
};

export const createPreview = (): PreviewHandles => {
  let iframe: HTMLIFrameElement | null = null;
  let unsubscribe: (() => void) | null = null;
  let activeIds = new Set<string>();

  const render = () => {
    if (!iframe) return;
    const config = getConfig();
    const compiled = compile(config);
    const css = [
      compiled['tokens.css'],
      compiled['utilities.css'],
      compiled['components.css'],
      compiled['index.css'],
    ].join('\n');
    const filteredModules =
      activeIds.size === 0
        ? previewModules
        : previewModules.filter((mod: PreviewModule) => activeIds.has(String(mod.id)));
    writePreviewDocument(iframe, css, config.mode, filteredModules);
  };

  const mount = (container: HTMLElement) => {
    iframe = createIframe();
    container.innerHTML = '';
    container.appendChild(iframe);
    unsubscribe = subscribe(render);
    render();
  };

  const unmount = () => {
    if (unsubscribe) unsubscribe();
    unsubscribe = null;
    iframe?.remove();
    iframe = null;
  };

  const setActive = (ids: string[]) => {
    activeIds = new Set(ids.map(String));
    render();
  };

  return { mount, unmount, setActive };
};

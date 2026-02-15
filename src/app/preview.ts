import { compile } from '../compiler/compile';
import type { ThemeConfig } from '../compiler/types';

import type { PreviewModule } from './preview-registry';
import { previewModules } from './preview-registry';
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
  iframe.style.background = 'var(--surface-bg, #ffffff)';
  return iframe;
};

    const writePreviewDocument = (
  iframe: HTMLIFrameElement,
  css: string,
  config: ThemeConfig,
  modules = previewModules satisfies PreviewModule[]
): void => {
  const themeAttr = config.mode === 'dark' ? 'data-theme="dark"' : '';
  iframe.srcdoc = `
    <!doctype html>
    <html ${themeAttr}>
      <head>
        <style>
          :root { 
            font-family: var(--font-family, Inter, "Segoe UI", system-ui, -apple-system, sans-serif); 
            background: var(--surface-bg, #ffffff);
            color: var(--on-background, #0f172a);
          }
          body {
            margin: 0;
            background: var(--surface-bg, #ffffff);
            color: var(--on-background, #0f172a);
            padding: 16px;
            display: grid;
            gap: 16px;
            min-height: 100vh;
            box-sizing: border-box;
          }
          .preview-accordion {
            border: 1px solid color-mix(in srgb, var(--on-background) 15%, transparent);
            border-radius: 8px;
            overflow: hidden;
            background: color-mix(in srgb, var(--on-background) 2%, transparent);
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
                <div class="preview-pane">${mod.render(config)}</div>
              </details>
            `
          )
          .join('\n')}
      </body>
    </html>
  `;
};

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

const VIEWPORT_WIDTHS: Record<ViewportSize, string> = {
  mobile: '375px',
  tablet: '768px',
  desktop: '100%',
};

export const createPreview = (): PreviewHandles => {
  let iframe: HTMLIFrameElement | null = null;
  let toolbar: HTMLElement | null = null;
  let container: HTMLElement | null = null;
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
    writePreviewDocument(iframe, css, config, filteredModules);
  };

  const setViewport = (size: ViewportSize) => {
    if (iframe) {
      iframe.style.width = VIEWPORT_WIDTHS[size];
    }
    if (toolbar) {
      toolbar.querySelectorAll('button').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.size === size);
      });
    }
  };

  const mount = (host: HTMLElement) => {
    host.innerHTML = '';

    // Create Toolbar
    toolbar = document.createElement('div');
    toolbar.className = 'preview-toolbar';
    toolbar.innerHTML = `
      <button type="button" data-size="mobile">Mobile</button>
      <button type="button" data-size="tablet">Tablet</button>
      <button type="button" data-size="desktop" class="active">Desktop</button>
    `;
    toolbar.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('button');
      if (btn?.dataset.size) {
        setViewport(btn.dataset.size as ViewportSize);
      }
    });

    // Create Iframe Container (for centering)
    container = document.createElement('div');
    container.className = 'preview-viewport-container';

    iframe = createIframe();
    container.appendChild(iframe);

    host.appendChild(toolbar);
    host.appendChild(container);

    unsubscribe = subscribe(render);
    render();
  };

  const unmount = () => {
    if (unsubscribe) unsubscribe();
    unsubscribe = null;
    iframe?.remove();
    toolbar?.remove();
    container?.remove();
    iframe = null;
    toolbar = null;
    container = null;
  };

  const setActive = (ids: string[]) => {
    activeIds = new Set(ids.map(String));
    render();
  };

  return { mount, unmount, setActive };
};

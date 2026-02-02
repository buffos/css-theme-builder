import { getConfig, subscribe } from './state';

type PreviewHandles = {
  mount: (container: HTMLElement) => void;
  unmount: () => void;
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

const writePreviewDocument = (iframe: HTMLIFrameElement, css: string): void => {
  iframe.srcdoc = `
    <!doctype html>
    <html>
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
          .placeholder {
            border: 1px dashed #2c3a63;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
            color: #9cb2f3;
          }
        </style>
        <style>${css}</style>
      </head>
      <body>
        <div class="placeholder">
          Preview components will render here once compiler and UI are wired.
        </div>
      </body>
    </html>
  `;
};

export const createPreview = (): PreviewHandles => {
  let iframe: HTMLIFrameElement | null = null;
  let unsubscribe: (() => void) | null = null;

  const render = () => {
    if (!iframe) return;
    const config = getConfig();
    // TODO: replace with real compiler output. For now, inject a comment showing the current theme name.
    const css = `/* theme: ${config.name} | mode: ${config.mode} */`;
    writePreviewDocument(iframe, css);
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

  return { mount, unmount };
};

import type { PreviewModule } from '../../app/preview-registry';
import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    layout: {
      breakpoints: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
      };
      container: string;
      gutter: string;
    };
  }
}

export const layoutCompilerEntry = {
  id: 'layout' as const,
  title: 'Layout',
  isEnabled: (_config: ThemeConfig) => true,
  emitTokens: (config: ThemeConfig) => {
    const l = config.layout;
    if (!l) return '';
    return [
      `--breakpoint-sm: ${l.breakpoints.sm};`,
      `--breakpoint-md: ${l.breakpoints.md};`,
      `--breakpoint-lg: ${l.breakpoints.lg};`,
      `--breakpoint-xl: ${l.breakpoints.xl};`,
      `--container-width: ${l.container};`,
      `--layout-gutter: ${l.gutter};`,
    ].join('\n  ');
  },
  emitUtilities: (_config: ThemeConfig) => {
    return `
.container {
  width: 100%;
  max-width: var(--container-width);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--layout-gutter);
  padding-right: var(--layout-gutter);
  box-sizing: border-box;
}
`;
  }
};

export const layoutControlModule: ControlModule = {
  id: 'layout',
  title: 'Layout & Grid',
  mount: (container, api) => {
    container.innerHTML = `
      <div class="control-grid">
        <div class="control-group">
          <label for="lay-sm">Breakpoint SM</label>
          <div class="range-with-value">
            <input id="lay-sm" name="sm" type="range" min="320" max="640" step="8" />
            <span class="range-value" id="lay-sm-val">640px</span>
          </div>
        </div>
        <div class="control-group">
          <label for="lay-md">Breakpoint MD</label>
          <div class="range-with-value">
            <input id="lay-md" name="md" type="range" min="640" max="1024" step="8" />
            <span class="range-value" id="lay-md-val">768px</span>
          </div>
        </div>
      </div>
      <div class="control-grid">
        <div class="control-group">
          <label for="lay-lg">Breakpoint LG</label>
          <div class="range-with-value">
            <input id="lay-lg" name="lg" type="range" min="1024" max="1440" step="8" />
            <span class="range-value" id="lay-lg-val">1024px</span>
          </div>
        </div>
        <div class="control-group">
          <label for="lay-xl">Breakpoint XL</label>
          <div class="range-with-value">
            <input id="lay-xl" name="xl" type="range" min="1440" max="2560" step="16" />
            <span class="range-value" id="lay-xl-val">1280px</span>
          </div>
        </div>
      </div>
      <hr style="opacity: 0.1; margin: 1rem 0;" />
      <div class="control-grid">
        <div class="control-group">
          <label for="lay-container">Container Max</label>
          <div class="range-with-value">
            <input id="lay-container" name="container" type="range" min="640" max="1600" step="40" />
            <span class="range-value" id="lay-container-val">1200px</span>
          </div>
        </div>
        <div class="control-group">
          <label for="lay-gutter">Grid Gutter</label>
          <div class="range-with-value">
            <input id="lay-gutter" name="gutter" type="range" min="8" max="64" step="4" />
            <span class="range-value" id="lay-gutter-val">24px</span>
          </div>
        </div>
      </div>
    `;

    const inputs = {
      sm: container.querySelector<HTMLInputElement>('#lay-sm'),
      md: container.querySelector<HTMLInputElement>('#lay-md'),
      lg: container.querySelector<HTMLInputElement>('#lay-lg'),
      xl: container.querySelector<HTMLInputElement>('#lay-xl'),
      container: container.querySelector<HTMLInputElement>('#lay-container'),
      gutter: container.querySelector<HTMLInputElement>('#lay-gutter'),
    };

    const values = {
      sm: container.querySelector<HTMLElement>('#lay-sm-val'),
      md: container.querySelector<HTMLElement>('#lay-md-val'),
      lg: container.querySelector<HTMLElement>('#lay-lg-val'),
      xl: container.querySelector<HTMLElement>('#lay-xl-val'),
      container: container.querySelector<HTMLElement>('#lay-container-val'),
      gutter: container.querySelector<HTMLElement>('#lay-gutter-val'),
    };

    const sync = () => {
      const cfg = api.getConfig().layout;
      if (!cfg) return;

      const pairs: [keyof typeof inputs, string][] = [
        ['sm', cfg.breakpoints.sm],
        ['md', cfg.breakpoints.md],
        ['lg', cfg.breakpoints.lg],
        ['xl', cfg.breakpoints.xl],
        ['container', cfg.container],
        ['gutter', cfg.gutter],
      ];

      pairs.forEach(([key, val]) => {
        const input = inputs[key];
        const display = values[key];
        if (input) input.value = val.replace('px', '');
        if (display) display.textContent = val;
      });
    };

    const onInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const key = target.name;
      const val = `${target.value}px`;

      api.updateConfig((cfg) => {
        const l = cfg.layout ?? layoutDefaults.layout;
        if (['sm', 'md', 'lg', 'xl'].includes(key)) {
          return {
            ...cfg,
            layout: {
              ...l,
              breakpoints: { ...l.breakpoints, [key]: val }
            }
          };
        }
        return {
          ...cfg,
          layout: { ...l, [key]: val }
        };
      });
    };

    Object.values(inputs).forEach(input => input?.addEventListener('input', onInput));
    const unsubscribe = api.subscribe(sync);
    sync();

    return () => {
      Object.values(inputs).forEach(input => input?.removeEventListener('input', onInput));
      unsubscribe();
    };
  }
};

export const layoutPreviewModule: PreviewModule = {
  id: 'layout',
  title: 'Layout & Breakpoints',
  render: (config: ThemeConfig) => `
    <div style="display: flex; flex-direction: column; gap: 2rem; color: var(--on-background);">
      <section>
        <h4 style="margin: 0 0 1rem 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6;">Breakpoint Visualizer</h4>
        <div style="display: flex; flex-direction: column; gap: 0.5rem; background: var(--surface-card); padding: 1rem; border-radius: 8px; border: 1px solid rgba(128,128,128,0.1);">
          <div style="height: 4px; background: rgba(128,128,128,0.1); border-radius: 2px; position: relative;">
            <div style="position: absolute; left: 0; top: 0; height: 100%; width: var(--breakpoint-sm); background: var(--color-primary-300); opacity: 0.4;"></div>
            <div style="position: absolute; left: 0; top: 0; height: 100%; width: var(--breakpoint-md); background: var(--color-primary-400); opacity: 0.4;"></div>
            <div style="position: absolute; left: 0; top: 0; height: 100%; width: var(--breakpoint-lg); background: var(--color-primary-500); opacity: 0.4;"></div>
            <div style="position: absolute; left: 0; top: 0; height: 100%; width: var(--breakpoint-xl); background: var(--color-primary-600); opacity: 0.4;"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 700;">
            <span>SM: ${config.layout?.breakpoints.sm}</span>
            <span>MD: ${config.layout?.breakpoints.md}</span>
            <span>LG: ${config.layout?.breakpoints.lg}</span>
            <span>XL: ${config.layout?.breakpoints.xl}</span>
          </div>
          <p style="font-size: 11px; margin: 0.5rem 0 0; opacity: 0.6;">
            The active breakpoint is determined by the current viewport width. Use the mobile/tablet buttons to test.
          </p>
        </div>
      </section>

      <section>
        <h4 style="margin: 0 0 1rem 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6;">Container & Gutter Demo</h4>
        <div style="background: var(--surface-bg); border: 2px dashed rgba(128,128,128,0.2); border-radius: 8px; overflow: hidden;">
          <div class="container" style="background: color-mix(in srgb, var(--color-primary-500) 10%, transparent); min-height: 100px; display: flex; align-items: center; justify-content: center; text-align: center;">
            <div style="padding: 1rem; background: var(--surface-card); border-radius: 4px; box-shadow: var(--shadow-sm); width: 100%;">
              <div style="font-weight: 800; font-size: 14px;">Container Content</div>
              <div style="font-size: 11px; opacity: 0.6;">MaxWidth: ${config.layout?.container} | Gutter: ${config.layout?.gutter}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
};

export const layoutDefaults = {
  layout: {
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    container: '1200px',
    gutter: '24px',
  }
};

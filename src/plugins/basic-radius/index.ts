import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    radius: Record<string, string>;
  }
}

export const radiusCompilerEntry = {
  id: 'radius' as const,
  title: 'Radius',
  isEnabled: (config: ThemeConfig) => Boolean(config.radius),
  emitTokens: (config: ThemeConfig) => {
    if (!config.radius) return '';
    const lines = Object.keys(config.radius)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => `  --radius-${key}: ${config.radius[key]};`);
    return lines.join('\n');
  },
  emitUtilities: (config: ThemeConfig) => {
    if (!config.radius) return '';
    return Object.keys(config.radius)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => `.rounded-${key} { border-radius: var(--radius-${key}); }`)
      .join('\n');
  },
  emitComponents: () => '',
};

export const radiusControlModule: ControlModule = {
  id: 'radius',
  title: 'Radius',
  mount: (container, api) => {
    container.innerHTML = `
      <div class="control-grid">
        <div class="control-group">
          <label for="radius-sm">Small (sm)</label>
          <div class="range-with-value">
            <input id="radius-sm" name="radius-sm" type="range" min="0" max="32" step="1" />
            <span class="range-value" id="radius-sm-val">0px</span>
          </div>
        </div>
        <div class="control-group">
          <label for="radius-md">Medium (md)</label>
          <div class="range-with-value">
            <input id="radius-md" name="radius-md" type="range" min="0" max="48" step="1" />
            <span class="range-value" id="radius-md-val">0px</span>
          </div>
        </div>
        <div class="control-group">
          <label for="radius-lg">Large (lg)</label>
          <div class="range-with-value">
            <input id="radius-lg" name="radius-lg" type="range" min="0" max="64" step="1" />
            <span class="range-value" id="radius-lg-val">0px</span>
          </div>
        </div>
      </div>
      <p class="controls-placeholder">
        Adjust corner rounding for tokens and utilities.
      </p>
    `;

    const inputs = {
      sm: container.querySelector<HTMLInputElement>('#radius-sm'),
      md: container.querySelector<HTMLInputElement>('#radius-md'),
      lg: container.querySelector<HTMLInputElement>('#radius-lg'),
    };

    const values = {
      sm: container.querySelector<HTMLElement>('#radius-sm-val'),
      md: container.querySelector<HTMLElement>('#radius-md-val'),
      lg: container.querySelector<HTMLElement>('#radius-lg-val'),
    };

    const sync = () => {
      const cfg = api.getConfig();
      if (!cfg.radius) return;

      Object.entries(inputs).forEach(([key, input]) => {
        if (input && cfg.radius?.[key]) {
          const val = Number.parseInt(cfg.radius[key], 10) || 0;
          input.value = String(val);
          if (values[key as keyof typeof values]) {
            values[key as keyof typeof values]!.textContent = `${val}px`;
          }
        }
      });
    };

    const onChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const key = target.name.replace('radius-', '');
      const val = `${target.value}px`;

      api.updateConfig((cfg) => ({
        ...cfg,
        radius: {
          ...cfg.radius,
          [key]: val,
        },
      }));
    };

    Object.values(inputs).forEach((input) => {
      input?.addEventListener('input', onChange);
    });

    const unsubscribe = api.subscribe(sync);
    sync();

    return () => {
      unsubscribe();
      Object.values(inputs).forEach((input) => {
        input?.removeEventListener('input', onChange);
      });
    };
  },
};

export const radiusPreviewModule = {
  id: 'radius',
  title: 'Radii Gallery',
  render: (_config: ThemeConfig) => {
    return `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 16px;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <div class="rounded-sm" style="width: 80px; height: 80px; background: var(--color-primary-500); border: 2px solid var(--color-primary-600);"></div>
          <span style="font-size: 11px; font-weight: 600;">Small (sm)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <div class="rounded-md" style="width: 80px; height: 80px; background: var(--color-primary-500); border: 2px solid var(--color-primary-600);"></div>
          <span style="font-size: 11px; font-weight: 600;">Medium (md)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <div class="rounded-lg" style="width: 80px; height: 80px; background: var(--color-primary-500); border: 2px solid var(--color-primary-600);"></div>
          <span style="font-size: 11px; font-weight: 600;">Large (lg)</span>
        </div>
      </div>
    `;
  },
};

export const radiusDefaults = {
  radius: { sm: '4px', md: '8px', lg: '16px' },
};

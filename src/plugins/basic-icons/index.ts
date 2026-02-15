import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    icons: {
      sizes: Record<string, string>;
      stroke: Record<string, string>;
    };
  }
}

export const iconsCompilerEntry = {
  id: 'icons' as const,
  title: 'Iconography',
  isEnabled: (config: ThemeConfig) => Boolean(config.icons),
  emitTokens: (config: ThemeConfig) => {
    if (!config.icons) return '';
    const sizeLines = Object.keys(config.icons.sizes)
      .map((key) => `  --icon-size-${key}: ${config.icons.sizes[key]};`);
    const strokeLines = Object.keys(config.icons.stroke)
      .map((key) => `  --icon-stroke-${key}: ${config.icons.stroke[key]};`);
    return [...sizeLines, ...strokeLines].join('\n');
  },
  emitUtilities: (config: ThemeConfig) => {
    if (!config.icons) return '';
    const sizeUtils = Object.keys(config.icons.sizes)
      .map((key) => `.icon-${key} { width: var(--icon-size-${key}); height: var(--icon-size-${key}); }`);
    const strokeUtils = Object.keys(config.icons.stroke)
      .map((key) => `.icon-stroke-${key} { stroke-width: var(--icon-stroke-${key}); }`);
    return [...sizeUtils, ...strokeUtils].join('\n');
  },
  emitComponents: () => '',
};

export const iconsControlModule: ControlModule = {
  id: 'icons',
  title: 'Iconography Scale',
  mount: (container, api) => {
    const renderSizeInput = (key: string, label: string) => `
      <div class="control-group">
        <label for="icon-size-${key}">${label}</label>
        <div class="range-with-value">
          <input id="icon-size-${key}" name="icons.sizes.${key}" type="range" min="8" max="64" step="2" />
          <span class="range-value" id="icon-size-${key}-val">0px</span>
        </div>
      </div>
    `;

    const renderStrokeInput = (key: string, label: string) => `
      <div class="control-group">
        <label for="icon-stroke-${key}">${label}</label>
        <div class="range-with-value">
          <input id="icon-stroke-${key}" name="icons.stroke.${key}" type="range" min="0.5" max="4" step="0.5" />
          <span class="range-value" id="icon-stroke-${key}-val">0px</span>
        </div>
      </div>
    `;

    container.innerHTML = `
      <div class="icons-editor" style="display: grid; gap: 16px;">
        <div class="control-subgroup">
          <h4 style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; opacity: 0.6;">Sizes</h4>
          ${renderSizeInput('xs', 'Extra Small (xs)')}
          ${renderSizeInput('sm', 'Small (sm)')}
          ${renderSizeInput('md', 'Medium (md)')}
          ${renderSizeInput('lg', 'Large (lg)')}
          ${renderSizeInput('xl', 'Extra Large (xl)')}
        </div>
        <div class="control-subgroup" style="padding-top: 8px; border-top: 1px solid rgba(128,128,128,0.1);">
          <h4 style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; opacity: 0.6;">Stroke Weight</h4>
          ${renderStrokeInput('thin', 'Thin')}
          ${renderStrokeInput('base', 'Base')}
          ${renderStrokeInput('bold', 'Bold')}
        </div>
      </div>
    `;

    const sizeKeys = ['xs', 'sm', 'md', 'lg', 'xl'];
    const strokeKeys = ['thin', 'base', 'bold'];

    const sync = () => {
      const cfg = api.getConfig();
      if (!cfg.icons) return;

      sizeKeys.forEach((key) => {
        const input = container.querySelector<HTMLInputElement>(`#icon-size-${key}`);
        const valSpan = container.querySelector<HTMLElement>(`#icon-size-${key}-val`);
        if (input && cfg.icons.sizes[key]) {
          const val = Number.parseInt(cfg.icons.sizes[key], 10) || 0;
          input.value = String(val);
          if (valSpan) valSpan.textContent = `${val}px`;
        }
      });

      strokeKeys.forEach((key) => {
        const input = container.querySelector<HTMLInputElement>(`#icon-stroke-${key}`);
        const valSpan = container.querySelector<HTMLElement>(`#icon-stroke-${key}-val`);
        if (input && cfg.icons.stroke[key]) {
          const val = Number.parseFloat(cfg.icons.stroke[key]) || 0;
          input.value = String(val);
          if (valSpan) valSpan.textContent = `${val}`;
        }
      });
    };

    const onChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const path = target.name.split('.'); // ['icons', 'sizes'|'stroke', key]
      const key = path[2];
      const type = path[1] as 'sizes' | 'stroke';
      const val = type === 'sizes' ? `${target.value}px` : target.value;

      api.updateConfig((cfg) => ({
        ...cfg,
        icons: {
          ...cfg.icons,
          [type]: {
            ...cfg.icons[type],
            [key]: val,
          },
        },
      }));
    };

    container.addEventListener('input', onChange);
    const unsubscribe = api.subscribe(sync);
    sync();

    return () => {
      unsubscribe();
      container.removeEventListener('input', onChange);
    };
  }
};

export const iconsPreviewModule = {
  id: 'icons',
  title: 'Iconography Spec',
  render: (config: ThemeConfig) => {
    const icons = config.icons ?? iconsDefaults.icons;
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
    const strokes = ['thin', 'base', 'bold'];

    // Simple SVG Icon Template
    const iconSvg = (sizeClass: string, strokeClass: string) => `
      <svg class="${sizeClass} ${strokeClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="transition: all 0.2s ease;">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    `;

    return `
      <div style="color: var(--on-background); font-family: var(--font-family, sans-serif);">
        <h3>Icon Sizes</h3>
        <p style="font-size: 12px; opacity: 0.7; margin-bottom: 24px;">Standardized size scale for all interface icons.</p>
        
        <div style="display: flex; align-items: flex-end; gap: 32px; padding: 24px; background: var(--surface-card); border-radius: 12px; border: 1px solid rgba(128,128,128,0.1); margin-bottom: 40px;">
          ${sizes.map(s => `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
              <div style="color: var(--color-primary-500);">${iconSvg(`icon-${s}`, 'icon-stroke-base')}</div>
              <div style="text-align: center;">
                <div style="font-weight: 800; font-size: 10px;">${s.toUpperCase()}</div>
                <div style="font-size: 9px; opacity: 0.5;">${icons.sizes[s]}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <h3>Stroke Weights</h3>
        <p style="font-size: 12px; opacity: 0.7; margin-bottom: 24px;">Standardized line weights for stroked icon sets.</p>
        
        <div style="display: flex; gap: 40px; padding: 24px; background: var(--surface-card); border-radius: 12px; border: 1px solid rgba(128,128,128,0.1);">
          ${strokes.map(st => `
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="color: var(--color-primary-500);">${iconSvg('icon-lg', `icon-stroke-${st}`)}</div>
              <div>
                <div style="font-weight: 800; font-size: 11px;">${st.toUpperCase()}</div>
                <div style="font-size: 10px; opacity: 0.5;">${icons.stroke[st]}px</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },
};

export const iconsDefaults = {
  icons: {
    sizes: {
      xs: '12px',
      sm: '16px',
      md: '24px',
      lg: '32px',
      xl: '48px',
    },
    stroke: {
      thin: '1',
      base: '2',
      bold: '3',
    },
  },
};

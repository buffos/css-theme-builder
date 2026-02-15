import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    shadow: Record<string, string>;
  }
}

export const shadowCompilerEntry = {
  id: 'shadow' as const,
  title: 'Shadow',
  isEnabled: (config: ThemeConfig) => Boolean(config.shadow),
  emitTokens: (config: ThemeConfig) => {
    if (!config.shadow) return '';
    const lines = Object.keys(config.shadow)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => `  --shadow-${key}: ${config.shadow[key]};`);
    return lines.join('\n');
  },
  emitUtilities: (config: ThemeConfig) => {
    if (!config.shadow) return '';
    return Object.keys(config.shadow)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => `.shadow-${key} { box-shadow: var(--shadow-${key}); }`)
      .join('\n');
  },
  emitComponents: () => '',
};

export const shadowControlModule: ControlModule = {
  id: 'shadow',
  title: 'Shadow',
  mount: (container, api) => {
    const renderShadowInputs = (key: string, label: string) => `
      <div class="control-subgroup">
        <label>${label}</label>
        <div class="control-grid">
          <div class="control-group">
            <label for="shadow-${key}-x">X Offset</label>
            <input id="shadow-${key}-x" name="shadow-${key}-x" type="range" min="-20" max="20" step="1" />
          </div>
          <div class="control-group">
            <label for="shadow-${key}-y">Y Offset</label>
            <input id="shadow-${key}-y" name="shadow-${key}-y" type="range" min="-20" max="20" step="1" />
          </div>
          <div class="control-group">
            <label for="shadow-${key}-blur">Blur</label>
            <input id="shadow-${key}-blur" name="shadow-${key}-blur" type="range" min="0" max="50" step="1" />
          </div>
          <div class="control-group">
            <label for="shadow-${key}-spread">Spread</label>
            <input id="shadow-${key}-spread" name="shadow-${key}-spread" type="range" min="-20" max="20" step="1" />
          </div>
          <div class="control-group">
            <label for="shadow-${key}-opacity">Opacity</label>
            <input id="shadow-${key}-opacity" name="shadow-${key}-opacity" type="range" min="0" max="100" step="5" />
          </div>
        </div>
      </div>
    `;

    container.innerHTML = `
      <div class="shadow-editor">
        ${renderShadowInputs('sm', 'Small (sm)')}
        ${renderShadowInputs('md', 'Medium (md)')}
        ${renderShadowInputs('lg', 'Large (lg)')}
      </div>
    `;

    const parseShadow = (val: string) => {
      // Format: "X Y Blur Spread rgba(0,0,0,A)"
      const parts = val.split(' ');
      const x = Number.parseInt(parts[0], 10) || 0;
      const y = Number.parseInt(parts[1], 10) || 0;
      const blur = Number.parseInt(parts[2], 10) || 0;
      const spread = Number.parseInt(parts[3], 10) || 0;
      const rgbaRegex = /rgba\(0,\s*0,\s*0,\s*([\d.]+)\)/;
      const match = rgbaRegex.exec(val);
      const opacity = match ? Math.round(Number.parseFloat(match[1]) * 100) : 15;
      return { x, y, blur, spread, opacity };
    };

    const sync = () => {
      const cfg = api.getConfig();
      if (!cfg.shadow) return;

      ['sm', 'md', 'lg'].forEach((key) => {
        const val = cfg.shadow[key] ?? '0 0 0 0 rgba(0,0,0,0)';
        const { x, y, blur, spread, opacity } = parseShadow(val);
        
        const xi = container.querySelector<HTMLInputElement>(`#shadow-${key}-x`);
        const yi = container.querySelector<HTMLInputElement>(`#shadow-${key}-y`);
        const bi = container.querySelector<HTMLInputElement>(`#shadow-${key}-blur`);
        const si = container.querySelector<HTMLInputElement>(`#shadow-${key}-spread`);
        const oi = container.querySelector<HTMLInputElement>(`#shadow-${key}-opacity`);

        if (xi) xi.value = String(x);
        if (yi) yi.value = String(y);
        if (bi) bi.value = String(blur);
        if (si) si.value = String(spread);
        if (oi) oi.value = String(opacity);
      });
    };

    const onChange = () => {
      const nextShadows: Record<string, string> = {};
      
      ['sm', 'md', 'lg'].forEach((key) => {
        const x = container.querySelector<HTMLInputElement>(`#shadow-${key}-x`)?.value ?? '0';
        const y = container.querySelector<HTMLInputElement>(`#shadow-${key}-y`)?.value ?? '0';
        const blur = container.querySelector<HTMLInputElement>(`#shadow-${key}-blur`)?.value ?? '0';
        const spread = container.querySelector<HTMLInputElement>(`#shadow-${key}-spread`)?.value ?? '0';
        const opacity = Number(container.querySelector<HTMLInputElement>(`#shadow-${key}-opacity`)?.value ?? '15') / 100;
        
        nextShadows[key] = `${x}px ${y}px ${blur}px ${spread}px rgba(0,0,0,${opacity})`;
      });

      api.updateConfig((cfg) => ({
        ...cfg,
        shadow: nextShadows,
      }));
    };

    container.addEventListener('input', onChange);

    const unsubscribe = api.subscribe(sync);
    sync();

    return () => {
      unsubscribe();
      container.removeEventListener('input', onChange);
    };
  },
};

export const shadowPreviewModule = {
  id: 'shadow',
  title: 'Shadows Gallery',
  render: (_config: ThemeConfig) => {
    const cardStyle = `
      width: 100%;
      aspect-ratio: 1;
      background: var(--color-primary-500);
      color: var(--on-primary);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      transition: box-shadow 0.3s ease;
    `;

    return `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 24px; padding: 16px 0;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
          <div class="shadow-sm" style="${cardStyle}">sm</div>
          <span style="font-size: 11px; font-weight: 600; opacity: 0.7;">Small (sm)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
          <div class="shadow-md" style="${cardStyle}">md</div>
          <span style="font-size: 11px; font-weight: 600; opacity: 0.7;">Medium (md)</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
          <div class="shadow-lg" style="${cardStyle}">lg</div>
          <span style="font-size: 11px; font-weight: 600; opacity: 0.7;">Large (lg)</span>
        </div>
      </div>
    `;
  },
};

export const shadowDefaults = {
  shadow: {
    sm: '0 2px 4px 0 rgba(0,0,0,0.1)',
    md: '0 4px 12px 0 rgba(0,0,0,0.15)',
    lg: '0 12px 24px 0 rgba(0,0,0,0.2)',
  },
};

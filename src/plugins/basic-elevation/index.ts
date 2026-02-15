import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    elevation: Record<string, number>;
  }
}

export const elevationCompilerEntry = {
  id: 'elevation' as const,
  title: 'Elevation',
  isEnabled: (config: ThemeConfig) => Boolean(config.elevation),
  emitTokens: (config: ThemeConfig) => {
    if (!config.elevation) return '';
    const lines = Object.keys(config.elevation)
      .sort((a, b) => config.elevation[a] - config.elevation[b])
      .map((key) => `  --z-index-${key}: ${config.elevation[key]};`);
    return lines.join('\n');
  },
  emitUtilities: (config: ThemeConfig) => {
    if (!config.elevation) return '';
    return Object.keys(config.elevation)
      .map((key) => `.z-${key} { z-index: var(--z-index-${key}); }`)
      .join('\n');
  },
  emitComponents: () => '',
};

export const elevationControlModule: ControlModule = {
  id: 'elevation',
  title: 'Z-Index & Elevation',
  mount: (container, api) => {
    const renderElevationInput = (key: string, label: string) => `
      <div class="control-group">
        <label for="z-${key}">${label}</label>
        <div style="display: flex; gap: 8px; align-items: center;">
            <input id="z-${key}" name="z-${key}" type="number" step="1" style="flex: 1;" />
            <span style="font-size: 10px; opacity: 0.5; font-family: monospace;">z-${key}</span>
        </div>
      </div>
    `;

    container.innerHTML = `
      <div class="elevation-editor" style="display: grid; gap: 12px;">
        <p class="controls-placeholder">Define global stacking order. Higher values overlap lower values.</p>
        ${renderElevationInput('base', 'Base (Default)')}
        ${renderElevationInput('raised', 'Raised')}
        ${renderElevationInput('dropdown', 'Dropdown')}
        ${renderElevationInput('sticky', 'Sticky')}
        ${renderElevationInput('fixed', 'Fixed')}
        ${renderElevationInput('modal', 'Modal')}
        ${renderElevationInput('popover', 'Popover')}
        ${renderElevationInput('tooltip', 'Tooltip')}
        ${renderElevationInput('toast', 'Toast Notifications')}
      </div>
    `;

    const keys = ['base', 'raised', 'dropdown', 'sticky', 'fixed', 'modal', 'popover', 'tooltip', 'toast'];

    const sync = () => {
      const cfg = api.getConfig();
      if (!cfg.elevation) return;

      keys.forEach((key) => {
        const input = container.querySelector<HTMLInputElement>(`#z-${key}`);
        if (input) input.value = String(cfg.elevation?.[key] ?? 0);
      });
    };

    const onChange = () => {
      const nextElevation: Record<string, number> = {
          hide: -1,
          auto: 0, // Placeholder-ish
          max: 2147483647
      };
      
      keys.forEach((key) => {
        const input = container.querySelector<HTMLInputElement>(`#z-${key}`);
        if (input) nextElevation[key] = Number(input.value);
      });

      api.updateConfig((cfg) => ({
        ...cfg,
        elevation: { ...cfg.elevation, ...nextElevation },
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

export const elevationPreviewModule = {
  id: 'elevation',
  title: 'Elevation Spec',
  render: (config: ThemeConfig) => {
    const elev = config.elevation ?? elevationDefaults.elevation;
    
    // Create a visual stacking order list
    const sortedLevels = Object.entries(elev)
      .sort(([, a], [, b]) => a - b);

    return `
      <div style="color: var(--on-background);">
        <h3>Stacking Order</h3>
        <p style="font-size: 12px; opacity: 0.7; margin-bottom: 24px;">Global z-index tokens for preventing layer conflicts.</p>
        
        <div style="display: grid; gap: 8px; margin-bottom: 40px;">
          ${sortedLevels.map(([key, val]) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--surface-card); border-radius: 8px; border: 1px solid rgba(128,128,128,0.1);">
              <div>
                <span style="font-weight: 700; color: var(--color-primary-500);">--z-index-${key}</span>
                <div style="font-size: 10px; opacity: 0.6;">.z-${key}</div>
              </div>
              <code style="font-weight: 800; background: rgba(0,0,0,0.2); padding: 4px 8px; border-radius: 4px;">${val}</code>
            </div>
          `).join('')}
        </div>

        <h3>Visual Stacking Preview</h3>
        <div style="position: relative; height: 300px; display: flex; align-items: center; justify-content: center; background: #000; border-radius: 12px; overflow: hidden;">
            <div class="z-base" style="position: absolute; width: 200px; height: 120px; background: #1e293b; border: 2px solid #334155; border-radius: 8px; display: flex; align-items: flex-start; padding: 8px; color: #fff; font-size: 10px; transform: translate(-40px, -40px);">BASE (0)</div>
            <div class="z-raised" style="position: absolute; width: 200px; height: 120px; background: #334155; border: 2px solid #475569; border-radius: 8px; display: flex; align-items: flex-start; padding: 8px; color: #fff; font-size: 10px; transform: translate(-20px, -20px); box-shadow: var(--shadow-sm);">RAISED (10)</div>
            <div class="z-dropdown" style="position: absolute; width: 200px; height: 120px; background: #475569; border: 2px solid #64748b; border-radius: 8px; display: flex; align-items: flex-start; padding: 8px; color: #fff; font-size: 10px; transform: translate(0, 0); box-shadow: var(--shadow-md);">DROPDOWN (1000)</div>
            <div class="z-modal" style="position: absolute; width: 200px; height: 120px; background: var(--color-primary-500); border: 2px solid var(--color-primary-600); border-radius: 8px; display: flex; align-items: flex-start; padding: 8px; color: var(--on-primary); font-size: 10px; transform: translate(20px, 20px); box-shadow: var(--shadow-lg);">MODAL (1300)</div>
            <div class="z-tooltip" style="position: absolute; width: 80px; height: 30px; background: #fff; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #000; font-size: 9px; font-weight: 900; transform: translate(60px, 40px);">TOOLTIP (1500)</div>
        </div>
      </div>
    `;
  },
};

export const elevationDefaults = {
  elevation: {
    hide: -1,
    auto: 0,
    base: 0,
    raised: 10,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modal: 1300,
    popover: 1400,
    tooltip: 1500,
    toast: 1600,
    max: 2147483647
  }
};

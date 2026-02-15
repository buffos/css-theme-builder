import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    card: {
      overrides?: {
        bg?: string;
        radiusKey?: string;
        padding?: string;
        borderWeight?: string;
        borderColor?: string;
        shadowKey?: string;
        radiusToken?: string;
      };
    };
  }
}

export const cardCompilerEntry = {
  id: 'card' as const,
  title: 'Card',
  isEnabled: (_config: ThemeConfig) => true,
  emitComponents: (config: ThemeConfig) => {
    const overrides = config.card?.overrides;
    const radiusKey = overrides?.radiusToken ?? '2';
    const shadowKey = overrides?.shadowKey ?? '1';
    
    const vars = [
      `--card-bg: ${overrides?.bg ?? 'var(--surface-card, #0f1729)'};`,
      `--card-radius: var(--radius-${radiusKey}, 12px);` ,
      `--card-padding: ${overrides?.padding ?? '24px'};` ,
      `--card-border: ${overrides?.borderWeight ?? '1px'} solid ${overrides?.borderColor ?? 'var(--color-neutral-900, #0f172a)'};` ,
      `--card-shadow: var(--shadow-${shadowKey}, 0 2px 4px rgba(0,0,0,0.1));` ,
    ].join('\n  ');

    return `
.card {
  ${vars}
  box-sizing: border-box;
  padding: var(--card-padding);
  border-radius: var(--card-radius);
  background: var(--card-bg);
  color: var(--on-card, inherit);
  border: var(--card-border);
  box-shadow: var(--card-shadow);
  transition: transform 120ms ease, box-shadow 120ms ease;
}
.card--interactive:hover, .card--interactive.hover {
  cursor: pointer;
  transform: translateY(-2px);
  box-shadow: var(--shadow-2, 0 4px 6px rgba(0,0,0,0.1));
}
`;
  },
};

export const cardControlModule: ControlModule = {
  id: 'card',
  title: 'Card',
  mount: (container, api) => {
    container.innerHTML = `
      <div class="control-grid">
        <div class="control-group">
          <label for="card-ov-bg" style="display: flex; justify-content: space-between; align-items: center;">
            Background
            <button id="card-ov-bg-reset" class="text-btn" style="font-size: 10px; opacity: 0.6; cursor: pointer; border: none; background: none; color: inherit; padding: 0;">Reset</button>
          </label>
          <input id="card-ov-bg" name="bg" type="color" />
        </div>
        <div class="control-group">
          <label for="card-ov-radius">Corner Radius</label>
          <select id="card-ov-radius" name="radiusToken"></select>
        </div>
      </div>
      <div class="control-grid">
        <div class="control-group">
          <label for="card-ov-padding">Padding</label>
          <div class="range-with-value">
            <input id="card-ov-padding" name="padding" type="range" min="8" max="64" step="4" />
            <span class="range-value" id="card-ov-padding-val">24px</span>
          </div>
        </div>
        <div class="control-group">
          <label for="card-ov-border" style="display: flex; justify-content: space-between; align-items: center;">
            Border Weight
          </label>
          <div class="range-with-value">
            <input id="card-ov-border" name="borderWeight" type="range" min="0" max="8" step="1" />
            <span class="range-value" id="card-ov-border-val">1px</span>
          </div>
        </div>
        <div class="control-group">
          <label for="card-ov-border-color" style="display: flex; justify-content: space-between; align-items: center;">
            Border Color
            <button id="card-ov-border-color-reset" class="text-btn" style="font-size: 10px; opacity: 0.6; cursor: pointer; border: none; background: none; color: inherit; padding: 0;">Reset</button>
          </label>
          <input id="card-ov-border-color" name="borderColor" type="color" />
        </div>
      </div>
      <div class="control-group">
        <label for="card-ov-shadow">Shadow Level</label>
        <select id="card-ov-shadow" name="shadowKey"></select>
      </div>
      <p class="controls-placeholder">
        Customize card properties using theme tokens and granular controls.
      </p>
    `;

    const inputs = {
      bg: container.querySelector<HTMLInputElement>('#card-ov-bg'),
      bgReset: container.querySelector<HTMLButtonElement>('#card-ov-bg-reset'),
      radius: container.querySelector<HTMLSelectElement>('#card-ov-radius'),
      padding: container.querySelector<HTMLInputElement>('#card-ov-padding'),
      border: container.querySelector<HTMLInputElement>('#card-ov-border'),
      borderColor: container.querySelector<HTMLInputElement>('#card-ov-border-color'),
      borderColorReset: container.querySelector<HTMLButtonElement>('#card-ov-border-color-reset'),
      shadow: container.querySelector<HTMLSelectElement>('#card-ov-shadow'),
    };

    const values = {
      padding: container.querySelector<HTMLElement>('#card-ov-padding-val'),
      border: container.querySelector<HTMLElement>('#card-ov-border-val'),
    };

    const refreshOptions = () => {
      const cfg = api.getConfig();
      if (inputs.radius) {
        const keys = Object.keys(cfg.radius ?? {}).sort((a, b) => a.localeCompare(b));
        inputs.radius.innerHTML = keys.map(k => `<option value="${k}">${k}</option>`).join('');
      }
      if (inputs.shadow) {
        const keys = Object.keys(cfg.shadow ?? {}).sort((a, b) => a.localeCompare(b));
        inputs.shadow.innerHTML = keys.map(k => `<option value="${k}">${k}</option>`).join('');
      }
    };

    const sync = () => {
      const cfg = api.getConfig();
      refreshOptions();
      const ov = cfg.card?.overrides;

      const setVal = (el: HTMLInputElement | HTMLSelectElement | null, val: string) => {
        if (el) el.value = val;
      };

      const setToggle = (btn: HTMLButtonElement | null, active: boolean) => {
        if (btn) btn.style.display = active ? 'inline' : 'none';
      };

      setVal(inputs.bg, ov?.bg ?? '#ffffff');
      setToggle(inputs.bgReset, !!ov?.bg);

      setVal(inputs.borderColor, ov?.borderColor ?? '#0f172a');
      setToggle(inputs.borderColorReset, !!ov?.borderColor);

      setVal(inputs.radius, ov?.radiusToken ?? '2');
      setVal(inputs.shadow, ov?.shadowKey ?? '1');

      if (inputs.padding) {
        const val = Number.parseInt(ov?.padding ?? '24', 10);
        inputs.padding.value = String(val);
        if (values.padding) values.padding.textContent = `${val}px`;
      }
      
      if (inputs.border) {
        const val = Number.parseInt(ov?.borderWeight ?? '1', 10);
        inputs.border.value = String(val);
        if (values.border) values.border.textContent = `${val}px`;
      }
    };

    const onInputChange = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLSelectElement;
      const key = target.name;
      const val = target.value;
      if (!key) return;

      api.updateConfig((cfg) => {
        const currentOverrides = cfg.card?.overrides ?? {};
        const newOverrides = { ...currentOverrides };
        
        type CardOverrideKey = keyof NonNullable<NonNullable<ThemeConfig['card']>['overrides']>;
        
        if (key === 'padding' || key === 'borderWeight') {
          newOverrides[key as CardOverrideKey] = `${val}px`;
        } else {
          newOverrides[key as CardOverrideKey] = val;
        }

        return { ...cfg, card: { overrides: newOverrides } };
      });
    };

    const resetBg = (e: MouseEvent) => {
      e.preventDefault();
      const overrides = { ...api.getConfig().card?.overrides };
      delete overrides.bg;
      api.updateConfig((cfg) => ({ ...cfg, card: { overrides } }));
    };

    const resetBorderColor = (e: MouseEvent) => {
      e.preventDefault();
      const overrides = { ...api.getConfig().card?.overrides };
      delete overrides.borderColor;
      api.updateConfig((cfg) => ({ ...cfg, card: { overrides } }));
    };

    Object.values(inputs).forEach((input) => {
      if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement) {
        input.addEventListener('input', onInputChange);
      }
    });
    inputs.bgReset?.addEventListener('click', resetBg);
    inputs.borderColorReset?.addEventListener('click', resetBorderColor);

    const unsubscribe = api.subscribe(sync);
    sync();

    return () => {
      Object.values(inputs).forEach((input) => {
        if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement) {
          input.removeEventListener('input', onInputChange);
        }
      });
      inputs.bgReset?.removeEventListener('click', resetBg);
      inputs.borderColorReset?.removeEventListener('click', resetBorderColor);
      unsubscribe();
    };
  },
};

export const cardPreviewModule = {
  id: 'card',
  title: 'Card',
  render: (_config: ThemeConfig) => `
    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:1.5rem;">
      <div class="card">
        <h3 class="text-base" style="margin-top:0;">Static Card</h3>
        <p class="text-sm" style="margin:0; opacity:0.8;">This card is static and doesn't react to hover.</p>
      </div>
      <div class="card card--interactive">
        <h3 class="text-base" style="margin-top:0;">Interactive Card</h3>
        <p class="text-sm" style="margin:0; opacity:0.8;">Hover over me to see the elevation effect!</p>
      </div>
    </div>
  `,
};

export const cardDefaults = {
  card: {},
};

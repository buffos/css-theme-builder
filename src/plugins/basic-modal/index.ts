import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    modal: {
      backdropBlur?: string;
      backdropOpacity?: number;
      padding?: string;
      radiusToken?: string;
      maxWidth?: string;
      borderWeight?: string;
      borderColor?: string;
    };
  }
}

export const modalCompilerEntry = {
  id: 'modal' as const,
  title: 'Modal',
  isEnabled: (_config: ThemeConfig) => true,
  emitComponents: (config: ThemeConfig) => {
    const mCfg = config.modal;
    const padding = mCfg?.padding ?? '1rem';
    const borderWeight = mCfg?.borderWeight ?? '1px';
    const radiusToken = mCfg?.radiusToken ?? (Object.keys(config.radius ?? {})[0] ?? '2');
    const radius = `var(--radius-${radiusToken}, 12px)`;
    const blur = mCfg?.backdropBlur ?? '4px';
    const opacity = mCfg?.backdropOpacity ?? 0.5;
    const maxWidth = mCfg?.maxWidth ?? '520px';
    const borderColor = mCfg?.borderColor ?? 'var(--color-neutral-900)';

    return `
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--color-neutral-900) calc(${opacity} * 100%), transparent);
  backdrop-filter: blur(${blur});
  display: grid;
  place-items: center;
  z-index: 1000;
}
.modal {
  box-sizing: border-box;
  min-width: 200px;
  max-width: ${maxWidth};
  width: 100%;
  background: var(--surface-card);
  border: ${borderWeight} solid ${borderColor};
  border-radius: ${radius};
  box-shadow: var(--shadow-lg, 0 10px 30px rgba(0,0,0,0.25));
  padding: ${padding};
}
`;
  },
};

export const modalControlModule: ControlModule = {
  id: 'modal',
  title: 'Modal',
  mount: (container, api) => {
    container.innerHTML = `
      <div class="control-grid">
        <div class="control-section-header" style="grid-column: 1 / -1; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.6;">Backdrop</div>
        <div class="control-group">
          <label for="modal-blur">Backdrop Blur</label>
          <div class="range-with-value">
            <input id="modal-blur" name="backdropBlur" type="range" min="0" max="24" step="1" />
            <span class="range-value" id="modal-blur-val">4px</span>
          </div>
        </div>
        <div class="control-group">
          <label for="modal-opacity">Backdrop Opacity</label>
          <div class="range-with-value">
            <input id="modal-opacity" name="backdropOpacity" type="range" min="0" max="1" step="0.05" />
            <span class="range-value" id="modal-opacity-val">50%</span>
          </div>
        </div>

        <div class="control-section-header" style="grid-column: 1 / -1; margin-top: 16px; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.6;">Layout & Appearance</div>
        <div class="control-group">
          <label for="modal-padding">Padding</label>
          <div class="range-with-value">
            <input id="modal-padding" name="padding" type="range" min="8" max="48" step="4" />
            <span class="range-value" id="modal-padding-val">16px</span>
          </div>
        </div>
        <div class="control-group">
          <label for="modal-border">Border Weight</label>
          <div class="range-with-value">
            <input id="modal-border" name="borderWeight" type="range" min="0" max="8" step="1" />
            <span class="range-value" id="modal-border-val">1px</span>
          </div>
        </div>
        <div class="control-group">
          <label for="modal-border-color" style="display: flex; justify-content: space-between; align-items: center;">
            Border Color
            <button id="modal-border-color-reset" class="text-btn" style="font-size: 10px; opacity: 0.6; cursor: pointer; border: none; background: none; color: inherit; padding: 0;">Reset</button>
          </label>
          <input id="modal-border-color" name="borderColor" type="color" />
        </div>
        <div class="control-group">
          <label for="modal-max-width">Max Width</label>
          <div class="range-with-value">
            <input id="modal-max-width" name="maxWidth" type="range" min="300" max="800" step="10" />
            <span class="range-value" id="modal-max-width-val">520px</span>
          </div>
        </div>
        <div class="control-group">
          <label for="modal-radius">Corner Radius Token</label>
          <select id="modal-radius" name="radiusToken"></select>
        </div>
      </div>
    `;

    const inputs = {
      blur: container.querySelector<HTMLInputElement>('#modal-blur'),
      opacity: container.querySelector<HTMLInputElement>('#modal-opacity'),
      padding: container.querySelector<HTMLInputElement>('#modal-padding'),
      border: container.querySelector<HTMLInputElement>('#modal-border'),
      maxWidth: container.querySelector<HTMLInputElement>('#modal-max-width'),
      radius: container.querySelector<HTMLSelectElement>('#modal-radius'),
      borderColor: container.querySelector<HTMLInputElement>('#modal-border-color'),
      borderColorReset: container.querySelector<HTMLButtonElement>('#modal-border-color-reset'),
    };

    const values = {
      blur: container.querySelector<HTMLElement>('#modal-blur-val'),
      opacity: container.querySelector<HTMLElement>('#modal-opacity-val'),
      padding: container.querySelector<HTMLElement>('#modal-padding-val'),
      border: container.querySelector<HTMLElement>('#modal-border-val'),
      maxWidth: container.querySelector<HTMLElement>('#modal-max-width-val'),
    };

    const refreshRadiusOptions = () => {
      const select = inputs.radius;
      if (!select) return;
      const cfg = api.getConfig();
      const keys = Object.keys(cfg.radius ?? {}).sort((a, b) => a.localeCompare(b));
      select.innerHTML = '';
      keys.forEach((key) => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = key;
        select.appendChild(opt);
      });
    };

    const sync = () => {
      const cfg = api.getConfig();
      refreshRadiusOptions();
      const mCfg = cfg.modal;
      if (!mCfg) return;

      const setVal = (input: HTMLInputElement | null, val: string | number, valueEl: HTMLElement | null, suffix = 'px') => {
        if (!input) return;
        input.value = String(val);
        if (valueEl) valueEl.textContent = suffix === '%' ? `${Math.round(Number(val) * 100)}%` : `${val}${suffix}`;
      };

      setVal(inputs.blur, Number.parseInt(mCfg.backdropBlur ?? '4', 10), values.blur);
      setVal(inputs.opacity, mCfg.backdropOpacity ?? 0.5, values.opacity, '%');
      setVal(inputs.padding, Number.parseInt(mCfg.padding ?? '16', 10), values.padding);
      setVal(inputs.border, Number.parseInt(mCfg.borderWeight ?? '1', 10), values.border);
      setVal(inputs.maxWidth, Number.parseInt(mCfg.maxWidth ?? '520', 10), values.maxWidth);

      if (inputs.radius) {
        inputs.radius.value = mCfg.radiusToken ?? (Object.keys(cfg.radius ?? {}).sort((a, b) => a.localeCompare(b))[0] ?? '');
      }

      if (inputs.borderColor) {
        inputs.borderColor.value = mCfg.borderColor ?? '#0f172a';
        if (inputs.borderColorReset) inputs.borderColorReset.style.display = mCfg.borderColor ? 'inline' : 'none';
      }
    };

    const onInputChange = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLSelectElement;
      const key = target.name;
      const val = target.value;
      if (!key) return;

      api.updateConfig((cfg) => {
        const m = cfg.modal ?? {};
        let finalVal: string | number = val;
        if (['backdropBlur', 'padding', 'borderWeight', 'maxWidth'].includes(key)) {
          finalVal = `${val}px`;
        } else if (key === 'backdropOpacity') {
          finalVal = Number(val);
        }
        return {
          ...cfg,
          modal: { ...m, [key]: finalVal },
        };
      });
    };

    const resetBorderColor = (e: MouseEvent) => {
      e.preventDefault();
      api.updateConfig((cfg) => {
        const m = { ...cfg.modal };
        delete m.borderColor;
        return { ...cfg, modal: m };
      });
    };

    Object.values(inputs).forEach((input) => {
      if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement) {
        input.addEventListener('input', onInputChange);
      }
    });
    inputs.borderColorReset?.addEventListener('click', resetBorderColor);

    const unsubscribe = api.subscribe(sync);
    sync();

    return () => {
      Object.values(inputs).forEach((input) => {
        if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement) {
          input.removeEventListener('input', onInputChange);
        }
      });
      inputs.borderColorReset?.removeEventListener('click', resetBorderColor);
      unsubscribe();
    };
  },
};

export const modalPreviewModule = {
  id: 'modal',
  title: 'Modal',
  render: (_config: ThemeConfig) => `
    <div style="position: relative; height: 300px; width: 100%; overflow: hidden; border-radius: 8px; border: 1px solid var(--color-neutral-900, rgba(0,0,0,0.1));">
      <div style="padding: 1rem; color: var(--on-background);">
        <h4>Background Content</h4>
        <p>This content is behind the modal backdrop. Adjust blur and opacity to see the effect.</p>
        <button class="btn btn--primary">Dummy Button</button>
      </div>
      <div class="modal-backdrop" style="position: absolute;">
        <div class="modal" style="width: calc(100% - 2rem); max-width: 280px;">
          <h3 class="text-base" style="margin-top:0; color: var(--on-card);">Modal title</h3>
          <p class="text-sm" style="margin:0 0 0.75rem; color: var(--on-card); opacity: 0.8;">Modal body preview content.</p>
          <div style="display:flex; gap:0.5rem; justify-content:flex-end;">
            <button class="btn" type="button">Cancel</button>
            <button class="btn btn--primary" type="button">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  `,
};

export const modalDefaults = {
  modal: {
    backdropBlur: '4px',
    backdropOpacity: 0.5,
    padding: '24px',
    borderWeight: '1px',
    maxWidth: '520px',
    radiusToken: 'md',
  },
};

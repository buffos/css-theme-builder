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
  min-width: 320px;
  max-width: ${maxWidth};
  width: 100%;
  background: var(--surface-card);
  border: ${borderWeight} solid var(--color-neutral-900);
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
        <div class="control-section-header">Backdrop</div>
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

        <div class="control-section-header" style="margin-top: 16px;">Layout & Appearance</div>
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
    };

    const onChange = () => {
      const backdropBlur = `${inputs.blur?.value}px`;
      const backdropOpacity = Number(inputs.opacity?.value);
      const padding = `${inputs.padding?.value}px`;
      const borderWeight = `${inputs.border?.value}px`;
      const maxWidth = `${inputs.maxWidth?.value}px`;
      const radiusToken = inputs.radius?.value ?? undefined;

      api.updateConfig((cfg) => ({
        ...cfg,
        modal: { backdropBlur, backdropOpacity, padding, borderWeight, maxWidth, radiusToken },
      }));
    };

    Object.values(inputs).forEach((input) => input?.addEventListener('input', onChange));
    inputs.radius?.addEventListener('change', onChange);

    const unsubscribe = api.subscribe(sync);
    sync();

    return () => {
      unsubscribe();
      Object.values(inputs).forEach((input) => input?.removeEventListener('input', onChange));
      inputs.radius?.removeEventListener('change', onChange);
    };
  },
};

export const modalPreviewModule = {
  id: 'modal',
  title: 'Modal',
  render: () => `
    <div style="position: relative; height: 300px; width: 100%; overflow: hidden; border-radius: 8px; border: 1px solid var(--color-neutral-900);">
      <div style="padding: 1rem; color: var(--surface-fg);">
        <h4>Background Content</h4>
        <p>This content is behind the modal backdrop. Adjust blur and opacity to see the effect.</p>
        <button class="btn btn--primary">Dummy Button</button>
      </div>
      <div class="modal-backdrop" style="position: absolute;">
        <div class="modal" style="min-width: 260px;">
          <h3 class="text-base" style="margin-top:0; color: var(--surface-fg);">Modal title</h3>
          <p class="text-sm" style="margin:0 0 0.75rem; color: var(--surface-fg); opacity: 0.8;">Modal body preview content.</p>
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

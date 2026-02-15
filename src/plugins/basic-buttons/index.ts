import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

type ButtonDensity = 'comfortable' | 'compact' | 'spacious';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    buttons: {
      density?: ButtonDensity;
      overrides?: {
        bg?: string;
        fg?: string;
        radius?: string;
        border?: string;
      };
    };
  }
}

export const buttonsCompilerEntry = {
  id: 'buttons' as const,
  title: 'Buttons',
  isEnabled: (_config: ThemeConfig) => true,
  emitComponents: (config: ThemeConfig) => {
    const radiusKey =
      Object.keys(config.radius ?? {}).sort((a, b) => a.localeCompare(b))[0] ?? '1';
    const density = config.buttons?.density ?? 'comfortable';
    const overrides = config.buttons?.overrides;

    let padding = '0.65rem 1rem';
    if (density === 'compact') padding = '0.5rem 0.85rem';
    if (density === 'spacious') padding = '0.75rem 1.15rem';

    const defRadius = `var(--radius-${radiusKey}, var(--radius-1, 8px))`;
    const vars = [
      `--btn-bg: ${overrides?.bg ?? 'var(--surface-card)'};`,
      `--btn-fg: ${overrides?.fg ?? 'var(--surface-fg)'};`,
      `--btn-radius: ${overrides?.radius ?? defRadius};`,
      `--btn-border: ${overrides?.border ?? '1px solid var(--color-neutral-900)'};`,
    ].join('\n  ');

    return `
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: ${padding};
  ${vars}
  border-radius: var(--btn-radius);
  border: var(--btn-border);
  background: var(--btn-bg);
  color: var(--btn-fg);
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 160ms ease, opacity 120ms ease;
}
.btn:hover:not(:disabled), .btn.hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-1, 0 1px 3px rgba(0,0,0,0.15));
}
.btn:active:not(:disabled), .btn.active:not(:disabled) {
  transform: translateY(0);
}
.btn:focus-visible, .btn.focus {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--btn-bg) 40%, white);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn--primary {
  --btn-bg: ${overrides?.bg ?? 'var(--color-primary-500)'};
  --btn-border: ${overrides?.border ?? '1px solid var(--color-primary-600)'};
  --btn-fg: ${overrides?.fg ?? 'var(--on-primary)'};
}
`;
  },
};

export const buttonsControlModule: ControlModule = {
  id: 'buttons',
  title: 'Buttons',
  mount: (container, api) => {
    container.innerHTML = `
      <div class="control-grid">
        <div class="control-group">
          <label for="btn-radius-key">Base radius token</label>
          <select id="btn-radius-key" name="btn-radius-key"></select>
        </div>
        <div class="control-group">
          <label for="btn-density">Density</label>
          <select id="btn-density" name="btn-density">
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
            <option value="spacious">Spacious</option>
          </select>
        </div>
      </div>
      <div class="control-divider">Overrides</div>
      <div class="control-grid">
        <div class="control-group">
          <label for="btn-ov-bg">Background</label>
          <input id="btn-ov-bg" type="text" placeholder="e.g. #ff0000 or var(...)" />
        </div>
        <div class="control-group">
          <label for="btn-ov-fg">Text color</label>
          <input id="btn-ov-fg" type="text" placeholder="e.g. white" />
        </div>
      </div>
      <div class="control-grid">
        <div class="control-group">
          <label for="btn-ov-radius">Radius</label>
          <input id="btn-ov-radius" type="text" placeholder="e.g. 50% or 4px" />
        </div>
        <div class="control-group">
          <label for="btn-ov-border">Border</label>
          <input id="btn-ov-border" type="text" placeholder="e.g. 2px solid red" />
        </div>
      </div>
      <p class="controls-placeholder">
        Component overrides allow this component to diverge from global theme tokens.
      </p>
    `;

    const inputs = {
      radius: container.querySelector<HTMLSelectElement>('#btn-radius-key'),
      density: container.querySelector<HTMLSelectElement>('#btn-density'),
      ovBg: container.querySelector<HTMLInputElement>('#btn-ov-bg'),
      ovFg: container.querySelector<HTMLInputElement>('#btn-ov-fg'),
      ovRadius: container.querySelector<HTMLInputElement>('#btn-ov-radius'),
      ovBorder: container.querySelector<HTMLInputElement>('#btn-ov-border'),
    };

    const refreshRadiusOptions = () => {
      const select = inputs.radius;
      if (!select) return;
      const cfg = api.getConfig();
      const keys = Object.keys(cfg.radius ?? {}).sort((a, b) => a.localeCompare(b));
      select.innerHTML = '';
      if (keys.length === 0) {
        const opt = document.createElement('option');
        opt.value = '1';
        opt.textContent = '1 (fallback)';
        select.appendChild(opt);
        return;
      }
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
      const bCfg = cfg.buttons;
      if (inputs.radius) {
        inputs.radius.value =
          Object.keys(cfg.radius ?? {}).sort((a, b) => a.localeCompare(b))[0] ?? '';
      }
      if (inputs.density) inputs.density.value = bCfg?.density ?? 'comfortable';
      if (inputs.ovBg) inputs.ovBg.value = bCfg?.overrides?.bg ?? '';
      if (inputs.ovFg) inputs.ovFg.value = bCfg?.overrides?.fg ?? '';
      if (inputs.ovRadius) inputs.ovRadius.value = bCfg?.overrides?.radius ?? '';
      if (inputs.ovBorder) inputs.ovBorder.value = bCfg?.overrides?.border ?? '';
    };

    const onChange = () => {
      const density = (inputs.density?.value as ButtonDensity | undefined) ?? 'comfortable';
      const overrides = {
        bg: inputs.ovBg?.value.trim() ? inputs.ovBg.value.trim() : undefined,
        fg: inputs.ovFg?.value.trim() ? inputs.ovFg.value.trim() : undefined,
        radius: inputs.ovRadius?.value.trim() ? inputs.ovRadius.value.trim() : undefined,
        border: inputs.ovBorder?.value.trim() ? inputs.ovBorder.value.trim() : undefined,
      };

      api.updateConfig((cfg) => ({
        ...cfg,
        buttons: { density, overrides },
      }));
    };

    inputs.radius?.addEventListener('change', onChange);
    inputs.density?.addEventListener('change', onChange);
    inputs.ovBg?.addEventListener('input', onChange);
    inputs.ovFg?.addEventListener('input', onChange);
    inputs.ovRadius?.addEventListener('input', onChange);
    inputs.ovBorder?.addEventListener('input', onChange);

    const unsubscribe = api.subscribe(sync);
    sync();

    return () => {
      inputs.radius?.removeEventListener('change', onChange);
      inputs.density?.removeEventListener('change', onChange);
      unsubscribe();
    };
  },
};

export const buttonsPreviewModule = {
  id: 'buttons',
  title: 'Buttons',
  render: () => `
    <div style="display:grid; gap:1.5rem;">
      <div style="display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center;">
        <span style="width:70px; font-size:12px; opacity:0.6;">Default</span>
        <button class="btn" type="button">Normal</button>
        <button class="btn hover" type="button">Hover</button>
        <button class="btn active" type="button">Active</button>
        <button class="btn focus" type="button">Focus</button>
        <button class="btn" type="button" disabled>Disabled</button>
      </div>
      <div style="display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center;">
        <span style="width:70px; font-size:12px; opacity:0.6;">Primary</span>
        <button class="btn btn--primary" type="button">Normal</button>
        <button class="btn btn--primary hover" type="button">Hover</button>
        <button class="btn btn--primary active" type="button">Active</button>
        <button class="btn btn--primary focus" type="button">Focus</button>
        <button class="btn btn--primary" type="button" disabled>Disabled</button>
      </div>
    </div>
  `,
};

export const buttonsDefaults = {
  buttons: {},
};

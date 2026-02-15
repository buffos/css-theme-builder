import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    inputs: {
      radiusKey?: string;
    };
  }
}

export const inputsCompilerEntry = {
  id: 'inputs' as const,
  title: 'Inputs',
  isEnabled: (_config: ThemeConfig) => true,
  emitComponents: (config: ThemeConfig) => {
    const radiusKey =
      config.inputs?.radiusKey ??
      Object.keys(config.radius ?? {}).sort((a, b) => a.localeCompare(b))[0] ?? '1';
    return `
.input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border-radius: var(--radius-${radiusKey}, var(--radius-1, 8px));
  border: 1px solid var(--color-neutral-900);
  background: var(--surface-card);
  color: var(--on-card);
  transition: border-color 120ms ease, box-shadow 120ms ease;
}
.input:focus, .input.focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary-500) 30%, transparent);
}
.input--error {
  border-color: var(--color-danger-500);
}
`;
  },
};

export const inputsControlModule: ControlModule = {
  id: 'inputs',
  title: 'Inputs',
  mount: (container, api) => {
    container.innerHTML = `
      <div class="control-group">
        <label for="input-radius">Input radius token</label>
        <select id="input-radius" name="input-radius"></select>
      </div>
      <div class="control-group">
        <label for="input-error-color">Error color</label>
        <input id="input-error-color" name="input-error-color" type="color" />
      </div>
      <p class="controls-placeholder">
        Choose radius token key and error color; rest derives from tokens.
      </p>
    `;

    const radiusInput = container.querySelector<HTMLSelectElement>('#input-radius');
    const errorInput = container.querySelector<HTMLInputElement>('#input-error-color');

    const refreshRadiusOptions = () => {
      if (!radiusInput) return;
      const cfg = api.getConfig();
      const keys = Object.keys(cfg.radius ?? {}).sort((a, b) => a.localeCompare(b));
      radiusInput.innerHTML = '';
      if (keys.length === 0) {
        const opt = document.createElement('option');
        opt.value = '1';
        opt.textContent = '1 (fallback)';
        radiusInput.appendChild(opt);
        return;
      }
      keys.forEach((key) => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = key;
        radiusInput.appendChild(opt);
      });
    };

    const sync = () => {
      const cfg = api.getConfig();
      refreshRadiusOptions();
      if (radiusInput) {
        radiusInput.value =
          cfg.inputs?.radiusKey ??
          Object.keys(cfg.radius ?? {}).sort((a, b) => a.localeCompare(b))[0] ?? '';
      }
      if (errorInput && cfg.colors?.danger?.[500]) errorInput.value = cfg.colors.danger[500];
    };

    const onChange = () => {
      const radiusKey = radiusInput?.value;
      const errorColor = errorInput?.value ?? '#f05656';

      api.updateConfig((cfg) => ({
        ...cfg,
        colors: {
          ...cfg.colors,
          danger: { ...cfg.colors?.danger, 500: errorColor },
        },
        inputs: { radiusKey },
      }));
    };

    radiusInput?.addEventListener('change', onChange);
    errorInput?.addEventListener('input', onChange);

    const unsubscribe = api.subscribe(sync);
    sync();

    return () => {
      radiusInput?.removeEventListener('change', onChange);
      errorInput?.removeEventListener('input', onChange);
      unsubscribe();
    };
  },
};

export const inputsPreviewModule = {
  id: 'inputs',
  title: 'Inputs',
  render: (_config: ThemeConfig) => `
    <div style="display:grid; gap:1.25rem; max-width:400px;">
      <div style="display:grid; grid-template-columns: 80px 1fr; gap:1rem; align-items:center;">
        <span style="font-size:12px; opacity:0.6;">Normal</span>
        <input class="input" placeholder="Standard input" />
      </div>
      <div style="display:grid; grid-template-columns: 80px 1fr; gap:1rem; align-items:center;">
        <span style="font-size:12px; opacity:0.6;">Focus</span>
        <input class="input focus" placeholder="Focused state" value="Focused content" />
      </div>
      <div style="display:grid; grid-template-columns: 80px 1fr; gap:1rem; align-items:center;">
        <span style="font-size:12px; opacity:0.6;">Error</span>
        <input class="input input--error" placeholder="Error state" value="Invalid input" />
      </div>
    </div>
  `,
};

export const inputsDefaults = {
  inputs: {},
};

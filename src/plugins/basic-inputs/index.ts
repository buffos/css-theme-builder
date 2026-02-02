import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    /**
     * Expected shape:
     * radius: { [key: string]: string } // e.g., { "1": "8px", "2": "12px" }
     * colors.danger?.500: string        // used for input error state
     */
    inputs: Record<string, never>;
  }
}

export const inputsCompilerEntry = {
  id: 'inputs' as const,
  title: 'Inputs',
  isEnabled: (_config: ThemeConfig) => true,
  emitComponents: (config: ThemeConfig) => {
    const radiusKey = Object.keys(config.radius ?? {}).sort((a, b) => a.localeCompare(b))[0] ?? '1';
    return `
.input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border-radius: var(--radius-${radiusKey}, var(--radius-1, 8px));
  border: 1px solid var(--color-neutral-900, #0f172a);
  background: var(--surface-card, #0f1729);
  color: var(--surface-fg, #e7ecff);
  transition: border-color 120ms ease, box-shadow 120ms ease;
}
.input:focus {
  outline: none;
  border-color: var(--color-primary-500, #5b8def);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary-500, #5b8def) 30%, transparent);
}
.input--error {
  border-color: var(--color-danger-500, #f05656);
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
        <input id="input-radius" name="input-radius" type="text" placeholder="e.g., 1" />
      </div>
      <div class="control-group">
        <label for="input-error-color">Error color</label>
        <input id="input-error-color" name="input-error-color" type="color" />
      </div>
      <p class="controls-placeholder">
        Choose radius token key and error color; rest derives from tokens.
      </p>
    `;

    const radiusInput = container.querySelector<HTMLInputElement>('#input-radius');
    const errorInput = container.querySelector<HTMLInputElement>('#input-error-color');

    const sync = () => {
      const cfg = api.getConfig();
      const firstRadiusKey =
        Object.keys(cfg.radius ?? {}).sort((a, b) => a.localeCompare(b))[0] ?? '';
      if (radiusInput) radiusInput.value = firstRadiusKey;
      if (errorInput && cfg.colors?.danger?.[500]) errorInput.value = cfg.colors.danger[500];
    };

    const onRadiusChange = () => {
      const key = radiusInput?.value?.trim() ?? '1';
      api.updateConfig((cfg) => ({
        ...cfg,
        radius: {
          ...cfg.radius,
          [key]: cfg.radius?.[key] ?? cfg.radius?.['1'] ?? '8px',
        },
      }));
    };

    const onErrorChange = () => {
      const val = errorInput?.value ?? '#f05656';
      api.updateConfig((cfg) => ({
        ...cfg,
        colors: {
          ...cfg.colors,
          danger: { 500: val },
        },
      }));
    };

    radiusInput?.addEventListener('input', onRadiusChange);
    errorInput?.addEventListener('input', onErrorChange);

    const unsubscribe = api.subscribe(sync);
    sync();

    return () => {
      radiusInput?.removeEventListener('input', onRadiusChange);
      errorInput?.removeEventListener('input', onErrorChange);
      unsubscribe();
    };
  },
};

export const inputsPreviewModule = {
  id: 'inputs',
  title: 'Inputs',
  render: () => `
    <div style="display:grid; gap:0.75rem; max-width:360px;">
      <label class="text-sm">
        Label
        <input class="input" placeholder="Type something" />
      </label>
      <label class="text-sm">
        Error
        <input class="input input--error" placeholder="Invalid value" />
      </label>
    </div>
  `,
};

import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

type ButtonDensity = 'comfortable' | 'compact' | 'spacious';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    buttons: { density?: ButtonDensity };
  }
}

export const buttonsCompilerEntry = {
  id: 'buttons' as const,
  title: 'Buttons',
  isEnabled: (_config: ThemeConfig) => true,
  emitComponents: (config: ThemeConfig) => {
    const radiusKey = Object.keys(config.radius ?? {}).sort((a, b) => a.localeCompare(b))[0] ?? '1';
    const density =
      (config.buttons as { density?: ButtonDensity } | undefined)?.density ?? 'comfortable';
    let padding = '0.65rem 1rem';
    if (density === 'compact') padding = '0.5rem 0.85rem';
    if (density === 'spacious') padding = '0.75rem 1.15rem';

    return `
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: ${padding};
  border-radius: var(--radius-${radiusKey}, var(--radius-1, 8px));
  border: 1px solid var(--color-neutral-900, #0f172a);
  background: var(--surface-card, #0f1729);
  color: var(--surface-fg, #e7ecff);
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 160ms ease, opacity 120ms ease;
}
.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-1, 0 1px 3px rgba(0,0,0,0.15));
}
.btn:active:not(:disabled) {
  transform: translateY(0);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn--primary {
  background: var(--color-primary-500, #5b8def);
  border-color: var(--color-primary-600, #3f6ad8);
  color: var(--on-primary, #0b1021);
}
`;
  },
};

export const buttonsControlModule: ControlModule = {
  id: 'buttons',
  title: 'Buttons',
  mount: (container, api) => {
    container.innerHTML = `
      <div class="control-group">
        <label for="btn-radius-key">Button radius token</label>
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
      <p class="controls-placeholder">
        Button controls: radius token and density adjust padding.
      </p>
    `;

    const radiusSelect = container.querySelector<HTMLSelectElement>('#btn-radius-key');
    const densitySelect = container.querySelector<HTMLSelectElement>('#btn-density');

    const refreshRadiusOptions = () => {
      if (!radiusSelect) return;
      const cfg = api.getConfig();
      const keys = Object.keys(cfg.radius ?? {}).sort((a, b) => a.localeCompare(b));
      radiusSelect.innerHTML = '';
      if (keys.length === 0) {
        const opt = document.createElement('option');
        opt.value = '1';
        opt.textContent = '1 (fallback)';
        radiusSelect.appendChild(opt);
        return;
      }
      keys.forEach((key) => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = key;
        radiusSelect.appendChild(opt);
      });
    };

    const sync = () => {
      const cfg = api.getConfig();
      refreshRadiusOptions();
      const firstRadiusKey =
        Object.keys(cfg.radius ?? {}).sort((a, b) => a.localeCompare(b))[0] ?? '';
      if (radiusSelect) radiusSelect.value = firstRadiusKey;
      const density =
        (cfg.buttons as { density?: ButtonDensity } | undefined)?.density ?? 'comfortable';
      if (densitySelect) densitySelect.value = density;
    };

    const onRadiusChange = () => {
      const key = radiusSelect?.value ?? '1';
      api.updateConfig((cfg) => ({
        ...cfg,
        radius: {
          ...cfg.radius,
          [key]: cfg.radius?.[key] ?? cfg.radius?.['1'] ?? '8px',
        },
      }));
    };

    const onDensityChange = () => {
      const value = (densitySelect?.value as ButtonDensity) ?? 'comfortable';
      api.updateConfig((cfg) => ({
        ...cfg,
        buttons: { ...(cfg.buttons as { density?: ButtonDensity }), density: value },
      }));
    };

    radiusSelect?.addEventListener('change', onRadiusChange);
    densitySelect?.addEventListener('change', onDensityChange);

    const unsubscribe = api.subscribe(sync);
    sync();

    return () => {
      radiusSelect?.removeEventListener('change', onRadiusChange);
      densitySelect?.removeEventListener('change', onDensityChange);
      unsubscribe();
    };
  },
};

export const buttonsPreviewModule = {
  id: 'buttons',
  title: 'Buttons',
  render: () => `
    <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
      <button class="btn" type="button">Default</button>
      <button class="btn btn--primary" type="button">Primary</button>
      <button class="btn" type="button" disabled>Disabled</button>
    </div>
  `,
};

export const buttonsDefaults = {
  buttons: {},
};

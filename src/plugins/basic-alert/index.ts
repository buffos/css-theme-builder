import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    alert: {
      padding?: string;
      radiusToken?: string;
      borderWeight?: string;
    };
  }
}

export const alertCompilerEntry = {
  id: 'alert' as const,
  title: 'Alert',
  isEnabled: (_config: ThemeConfig) => true,
  emitComponents: (config: ThemeConfig) => {
    const alertCfg = config.alert;
    const padding = alertCfg?.padding ?? '1rem';
    const borderWeight = alertCfg?.borderWeight ?? '1px';
    const radiusToken = alertCfg?.radiusToken ?? (Object.keys(config.radius ?? {})[0] ?? '1');
    const radius = `var(--radius-${radiusToken}, 8px)`;

    const variants = [
      { name: 'danger', color: 'var(--color-danger-500)', on: 'var(--on-danger)' },
      { name: 'success', color: 'var(--color-success-500)', on: 'var(--on-success)' },
      { name: 'warning', color: 'var(--color-warning-500)', on: 'var(--on-warning)' },
      { name: 'info', color: 'var(--color-primary-500)', on: 'var(--on-primary)' },
    ];

    const variantStyles = variants
      .map(
        (v) => `
.alert--${v.name} {
  border-color: ${v.color};
  background: color-mix(in srgb, ${v.color} 10%, transparent);
  color: color-mix(in srgb, ${v.color} 80%, var(--color-neutral-900));
}
[data-theme='dark'] .alert--${v.name}, 
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) .alert--${v.name} {
    color: color-mix(in srgb, ${v.color} 80%, white);
    background: color-mix(in srgb, ${v.color} 15%, transparent);
  }
}`,
      )
      .join('\n');

    return `
.alert {
  padding: ${padding};
  border-radius: ${radius};
  border: ${borderWeight} solid transparent;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 14px;
  line-height: 1.5;
  transition: all var(--duration-base) var(--ease-in-out);
}
${variantStyles}
`;
  },
};

export const alertControlModule: ControlModule = {
  id: 'alert',
  title: 'Alert',
  mount: (container, api) => {
    container.innerHTML = `
      <div class="control-grid">
        <div class="control-group">
          <label for="alert-padding">Padding</label>
          <div class="range-with-value">
            <input id="alert-padding" name="padding" type="range" min="4" max="32" step="2" />
            <span class="range-value" id="alert-padding-val">16px</span>
          </div>
        </div>
        <div class="control-group">
          <label for="alert-border">Border Weight</label>
          <div class="range-with-value">
            <input id="alert-border" name="borderWeight" type="range" min="0" max="8" step="1" />
            <span class="range-value" id="alert-border-val">1px</span>
          </div>
        </div>
        <div class="control-group">
          <label for="alert-radius">Radius Token</label>
          <select id="alert-radius" name="radiusToken"></select>
        </div>
      </div>
      <p class="controls-placeholder">
        Customize the appearance of system alerts and status messages.
      </p>
    `;

    const inputs = {
      padding: container.querySelector<HTMLInputElement>('#alert-padding'),
      border: container.querySelector<HTMLInputElement>('#alert-border'),
      radius: container.querySelector<HTMLSelectElement>('#alert-radius'),
    };

    const values = {
      padding: container.querySelector<HTMLElement>('#alert-padding-val'),
      border: container.querySelector<HTMLElement>('#alert-border-val'),
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
      const aCfg = cfg.alert;

      if (inputs.padding) {
        const val = Number.parseInt(aCfg?.padding ?? '16', 10);
        inputs.padding.value = String(val);
        if (values.padding) values.padding.textContent = `${val}px`;
      }
      if (inputs.border) {
        const val = Number.parseInt(aCfg?.borderWeight ?? '1', 10);
        inputs.border.value = String(val);
        if (values.border) values.border.textContent = `${val}px`;
      }
      if (inputs.radius) {
        inputs.radius.value = aCfg?.radiusToken ?? (Object.keys(cfg.radius ?? {})[0] ?? '');
      }
    };

    const onChange = () => {
      const padding = `${inputs.padding?.value}px`;
      const borderWeight = `${inputs.border?.value}px`;
      const radiusToken = inputs.radius?.value ?? undefined;

      api.updateConfig((cfg) => ({
        ...cfg,
        alert: { padding, borderWeight, radiusToken },
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

export const alertPreviewModule = {
  id: 'alert',
  title: 'Alerts Gallery',
  render: (_config: ThemeConfig) => `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div class="alert alert--info">
        <span style="font-weight: bold;">Info:</span> Something happened; here is an alert preview.
      </div>
      <div class="alert alert--success">
        <span style="font-weight: bold;">Success:</span> Your changes have been saved successfully.
      </div>
      <div class="alert alert--warning">
        <span style="font-weight: bold;">Warning:</span> Your storage is almost full.
      </div>
      <div class="alert alert--danger">
        <span style="font-weight: bold;">Danger:</span> An error occurred while processing your request.
      </div>
    </div>
  `,
};

export const alertDefaults = {
  alert: {
    padding: '16px',
    borderWeight: '1px',
    radiusToken: 'md',
  },
};

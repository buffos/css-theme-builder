import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    alert: Record<string, never>;
  }
}

export const alertCompilerEntry = {
  id: 'alert' as const,
  title: 'Alert',
  isEnabled: (_config: ThemeConfig) => true,
  emitComponents: () => `
.alert {
  padding: var(--space-4, 1rem);
  border-radius: var(--radius-1, 8px);
  border: 1px solid var(--color-danger-500, #f05656);
  background: color-mix(in srgb, var(--color-danger-500, #f05656) 8%, transparent);
  color: var(--on-danger, #e7ecff);
}
`,
};

export const alertControlModule: ControlModule = {
  id: 'alert',
  title: 'Alert',
  mount: (container) => {
    container.innerHTML = `
      <p class="controls-placeholder">
        Alert controls will be added here (tone, spacing).
      </p>
    `;
  },
};

export const alertPreviewModule = {
  id: 'alert',
  title: 'Alert',
  render: () => `<div class="alert">Something happened; here is an alert preview.</div>`,
};

export const alertDefaults = {
  alert: {},
};

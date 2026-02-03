import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    modal: Record<string, never>;
  }
}

export const modalCompilerEntry = {
  id: 'modal' as const,
  title: 'Modal',
  isEnabled: (_config: ThemeConfig) => true,
  emitComponents: () => `
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
}
.modal {
  min-width: 320px;
  max-width: 520px;
  background: var(--surface-card, #0f1729);
  border: 1px solid var(--color-neutral-900, #0f172a);
  border-radius: var(--radius-2, 12px);
  box-shadow: var(--shadow-2, 0 10px 30px rgba(0,0,0,0.25));
  padding: var(--space-4, 1rem);
}
`,
};

export const modalControlModule: ControlModule = {
  id: 'modal',
  title: 'Modal',
  mount: (container) => {
    container.innerHTML = `
      <p class="controls-placeholder">
        Modal controls will be added here (backdrop, padding, radius).
      </p>
    `;
  },
};

export const modalPreviewModule = {
  id: 'modal',
  title: 'Modal',
  render: () => `
    <div class="modal-backdrop">
      <div class="modal">
        <h3 class="text-base" style="margin-top:0;">Modal title</h3>
        <p class="text-sm" style="margin:0 0 0.75rem;">Modal body preview content.</p>
        <div style="display:flex; gap:0.5rem; justify-content:flex-end;">
          <button class="btn" type="button">Cancel</button>
          <button class="btn btn--primary" type="button">Confirm</button>
        </div>
      </div>
    </div>
  `,
};

export const modalDefaults = {
  modal: {},
};

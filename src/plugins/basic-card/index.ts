import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    card: Record<string, never>;
  }
}

export const cardCompilerEntry = {
  id: 'card' as const,
  title: 'Card',
  isEnabled: (_config: ThemeConfig) => true,
  emitComponents: () => `
.card {
  padding: var(--space-4, 1rem);
  border-radius: var(--radius-2, 12px);
  background: var(--surface-card, #0f1729);
  border: 1px solid var(--color-neutral-900, #0f172a);
  box-shadow: var(--shadow-1, 0 1px 3px rgba(0,0,0,0.15));
}
`,
};

export const cardControlModule: ControlModule = {
  id: 'card',
  title: 'Card',
  mount: (container) => {
    container.innerHTML = `
      <p class="controls-placeholder">
        Card controls will be added here (padding, shadow, radius).
      </p>
    `;
  },
};

export const cardPreviewModule = {
  id: 'card',
  title: 'Card',
  render: () => `
    <div class="card">
      <h3 class="text-base" style="margin-top:0;">Card title</h3>
      <p class="text-sm" style="margin:0;">Body copy for card preview.</p>
    </div>
  `,
};

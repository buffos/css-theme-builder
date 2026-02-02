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

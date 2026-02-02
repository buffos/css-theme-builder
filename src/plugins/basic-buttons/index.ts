import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    buttons: Record<string, never>;
  }
}

export const buttonsCompilerEntry = {
  id: 'buttons' as const,
  title: 'Buttons',
  isEnabled: (_config: ThemeConfig) => true,
  emitComponents: () => `
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  border-radius: var(--radius-1, 8px);
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
  color: #0b1021;
}
`,
};

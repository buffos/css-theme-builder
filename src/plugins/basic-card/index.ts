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

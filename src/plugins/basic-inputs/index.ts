import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    inputs: Record<string, never>;
  }
}

export const inputsCompilerEntry = {
  id: 'inputs' as const,
  title: 'Inputs',
  isEnabled: (_config: ThemeConfig) => true,
  emitComponents: () => `
.input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border-radius: var(--radius-1, 8px);
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
`,
};

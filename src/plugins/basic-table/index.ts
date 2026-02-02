import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    table: Record<string, never>;
  }
}

export const tableCompilerEntry = {
  id: 'table' as const,
  title: 'Table',
  isEnabled: (_config: ThemeConfig) => true,
  emitComponents: () => `
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm-size, 0.875rem);
}
.table th,
.table td {
  padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
  border-bottom: 1px solid color-mix(in srgb, var(--color-neutral-900, #0f172a) 60%, transparent);
  text-align: left;
}
.table th {
  font-weight: 700;
  color: var(--surface-fg, #e7ecff);
}
.table tr:hover {
  background: color-mix(in srgb, var(--surface-card, #0f1729) 70%, transparent);
}
`,
};

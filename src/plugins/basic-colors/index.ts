import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

// Augment ThemeModules with colors section.
declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    colors: {
      primary: { 500: string; 600: string };
      neutral: { 50: string; 900: string };
      danger?: { 500: string };
    };
  }
}

// Compiler hooks for this plugin.
export const colorsCompilerEntry = {
  id: 'colors' as const,
  title: 'Colors',
  isEnabled: (config: ThemeConfig) =>
    Boolean(config.colors?.primary?.[500] && config.colors?.neutral?.[50]),
  emitTokens: (config: ThemeConfig) => {
    if (!config.colors) return '';
    const lines = [
      ':root {',
      `  --color-primary-500: ${config.colors.primary?.[500] ?? ''};`,
      `  --color-primary-600: ${config.colors.primary?.[600] ?? ''};`,
      `  --color-neutral-50: ${config.colors.neutral?.[50] ?? ''};`,
      `  --color-neutral-900: ${config.colors.neutral?.[900] ?? ''};`,
    ];
    if (config.colors.danger?.[500]) {
      lines.push(`  --color-danger-500: ${config.colors.danger[500]};`);
    }
    lines.push('}');
    return lines.join('\n');
  },
  emitUtilities: () =>
    [
      `.bg-primary { background: var(--color-primary-500); }`,
      `.bg-surface { background: var(--surface-bg); color: var(--surface-fg); }`,
      `.text-fg { color: var(--surface-fg); }`,
      `.border-subtle { border: 1px solid var(--color-neutral-900); }`,
    ].join('\n'),
};

// Controls stub for this plugin.
export const colorsControlModule: ControlModule = {
  id: 'colors',
  title: 'Colors',
  mount: (container) => {
    container.innerHTML = `
      <p class="controls-placeholder">
        Color controls will be added here.
      </p>
    `;
  },
};

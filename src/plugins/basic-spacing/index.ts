import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    spacing: Record<string, string>;
  }
}

const spacingUtilities = (spacing: Record<string, string>): string[] =>
  Object.keys(spacing)
    .sort((a, b) => a.localeCompare(b))
    .flatMap((key) => [
      `.p-${key} { padding: var(--space-${key}); }`,
      `.px-${key} { padding-left: var(--space-${key}); padding-right: var(--space-${key}); }`,
      `.py-${key} { padding-top: var(--space-${key}); padding-bottom: var(--space-${key}); }`,
      `.m-${key} { margin: var(--space-${key}); }`,
      `.gap-${key} { gap: var(--space-${key}); }`,
    ]);

export const spacingCompilerEntry = {
  id: 'spacing' as const,
  title: 'Spacing',
  isEnabled: (config: ThemeConfig) => Boolean(config.spacing),
  emitTokens: (config: ThemeConfig) => {
    if (!config.spacing) return '';
    const lines = Object.keys(config.spacing)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => `  --space-${key}: ${config.spacing[key]};`);
    return [':root {', ...lines, '}'].join('\n');
  },
  emitUtilities: (config: ThemeConfig) =>
    config.spacing ? spacingUtilities(config.spacing).join('\n') : '',
};

export const spacingControlModule: ControlModule = {
  id: 'spacing',
  title: 'Spacing',
  mount: (container) => {
    container.innerHTML = `
      <p class="controls-placeholder">
        Spacing controls will be added here.
      </p>
    `;
  },
};

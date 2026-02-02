import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    shadow: Record<string, string>;
  }
}

export const shadowCompilerEntry = {
  id: 'shadow' as const,
  title: 'Shadow',
  isEnabled: (config: ThemeConfig) => Boolean(config.shadow),
  emitTokens: (config: ThemeConfig) => {
    if (!config.shadow) return '';
    const lines = Object.keys(config.shadow)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => `  --shadow-${key}: ${config.shadow[key]};`);
    return [':root {', ...lines, '}'].join('\n');
  },
  emitUtilities: (config: ThemeConfig) => {
    if (!config.shadow) return '';
    return Object.keys(config.shadow)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => `.shadow-${key} { box-shadow: var(--shadow-${key}); }`)
      .join('\n');
  },
  emitComponents: () => '',
};

export const shadowControlModule: ControlModule = {
  id: 'shadow',
  title: 'Shadow',
  mount: (container) => {
    container.innerHTML = `
      <p class="controls-placeholder">
        Shadow controls will be added here.
      </p>
    `;
  },
};

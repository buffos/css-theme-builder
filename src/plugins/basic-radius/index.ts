import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    radius: Record<string, string>;
  }
}

export const radiusCompilerEntry = {
  id: 'radius' as const,
  title: 'Radius',
  isEnabled: (config: ThemeConfig) => Boolean(config.radius),
  emitTokens: (config: ThemeConfig) => {
    if (!config.radius) return '';
    const lines = Object.keys(config.radius)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => `  --radius-${key}: ${config.radius[key]};`);
    return [':root {', ...lines, '}'].join('\n');
  },
  emitUtilities: (config: ThemeConfig) => {
    if (!config.radius) return '';
    return Object.keys(config.radius)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => `.rounded-${key} { border-radius: var(--radius-${key}); }`)
      .join('\n');
  },
  emitComponents: () => '',
};

export const radiusControlModule: ControlModule = {
  id: 'radius',
  title: 'Radius',
  mount: (container) => {
    container.innerHTML = `
      <p class="controls-placeholder">
        Radius controls will be added here.
      </p>
    `;
  },
};

export const radiusDefaults = {
  radius: { 1: '8px', 2: '12px' },
};

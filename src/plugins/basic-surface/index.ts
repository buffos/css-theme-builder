import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

// Augment ThemeModules with surface section.
declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    surface: ThemeConfig['surface'];
  }
}

export const surfaceCompilerEntry = {
  id: 'surface' as const,
  title: 'Surface',
  isEnabled: (config: ThemeConfig) => Boolean(config.surface),
  emitTokens: (config: ThemeConfig) => {
    if (!config.surface) return '';
    return [
      ':root {',
      `  --surface-bg: ${config.surface.background};`,
      `  --surface-fg: ${config.surface.foreground};`,
      `  --surface-card: ${config.surface.card};`,
      '}',
    ].join('\n');
  },
};

export const surfaceControlModule: ControlModule = {
  id: 'surface',
  title: 'Surface',
  mount: (container) => {
    container.innerHTML = `
      <p class="controls-placeholder">
        Surface controls will be added here.
      </p>
    `;
  },
};

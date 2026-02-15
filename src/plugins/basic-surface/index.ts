import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

// Augment ThemeModules with surface section without referencing ThemeConfig to avoid cycles.
declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    surface: {
      background: string;
      foreground: string;
      card: string;
      darkBackgroundSnippet?: string; // Optional custom dark background
      darkForegroundSnippet?: string;
      darkCardSnippet?: string;
    };
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
  emitDarkTokens: (config: ThemeConfig) => {
    if (!config.surface) return '';
    const { darkBackgroundSnippet, darkForegroundSnippet, darkCardSnippet } = config.surface;
    return [
      ':root {',
      `  --surface-bg: ${darkBackgroundSnippet ?? '#0b1021'};`,
      `  --surface-fg: ${darkForegroundSnippet ?? '#e7ecff'};`,
      `  --surface-card: ${darkCardSnippet ?? '#0f1729'};`,
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
        Surface controls will be added here. (Dark mode surface defaults are applied).
      </p>
    `;
  },
};

export const surfaceDefaults = {
  surface: {
    background: '#fafafa',
    foreground: '#0b1021',
    card: '#ffffff',
    darkBackgroundSnippet: '#0b1021',
    darkForegroundSnippet: '#e7ecff',
    darkCardSnippet: '#0f1729',
  },
};

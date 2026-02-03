import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

// Augment ThemeModules with typography section (explicit shape to avoid cycles).
declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    typography: {
      fontFamily: string;
      baseFontSizePx: number;
      scale: {
        sm: { sizeRem: number; lineHeight: number };
        base: { sizeRem: number; lineHeight: number };
        lg: { sizeRem: number; lineHeight: number };
        xl: { sizeRem: number; lineHeight: number };
      };
    };
  }
}

export const typographyCompilerEntry = {
  id: 'typography' as const,
  title: 'Typography',
  isEnabled: (config: ThemeConfig) => Boolean(config.typography),
  emitTokens: (config: ThemeConfig) => {
    if (!config.typography) return '';
    const { fontFamily, baseFontSizePx, scale } = config.typography;
    return [
      ':root {',
      `  --font-family: ${fontFamily};`,
      `  --base-font-size: ${baseFontSizePx}px;`,
      `  --text-sm-size: ${scale.sm.sizeRem}rem;`,
      `  --text-sm-line: ${scale.sm.lineHeight};`,
      `  --text-base-size: ${scale.base.sizeRem}rem;`,
      `  --text-base-line: ${scale.base.lineHeight};`,
      `  --text-lg-size: ${scale.lg.sizeRem}rem;`,
      `  --text-lg-line: ${scale.lg.lineHeight};`,
      `  --text-xl-size: ${scale.xl.sizeRem}rem;`,
      `  --text-xl-line: ${scale.xl.lineHeight};`,
      '}',
    ].join('\n');
  },
  emitUtilities: () =>
    [
      `.text-sm { font-size: var(--text-sm-size); line-height: var(--text-sm-line); }`,
      `.text-base { font-size: var(--text-base-size); line-height: var(--text-base-line); }`,
      `.text-lg { font-size: var(--text-lg-size); line-height: var(--text-lg-line); }`,
      `.text-xl { font-size: var(--text-xl-size); line-height: var(--text-xl-line); }`,
    ].join('\n'),
};

export const typographyControlModule: ControlModule = {
  id: 'typography',
  title: 'Typography',
  mount: (container) => {
    container.innerHTML = `
      <p class="controls-placeholder">
        Typography controls will be added here.
      </p>
    `;
  },
};

export const typographyDefaults = {
  typography: {
    fontFamily: 'Inter, "Segoe UI", system-ui, -apple-system, sans-serif',
    baseFontSizePx: 16,
    scale: {
      sm: { sizeRem: 0.875, lineHeight: 1.4 },
      base: { sizeRem: 1, lineHeight: 1.6 },
      lg: { sizeRem: 1.125, lineHeight: 1.6 },
      xl: { sizeRem: 1.25, lineHeight: 1.6 },
    },
  },
};

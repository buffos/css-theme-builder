import { describe, it, expect } from 'vitest';

import type { ThemeConfig } from '../../compiler/types';

import { typographyCompilerEntry } from './index';

describe('Typography Plugin', () => {
  const baseConfig = {
    typography: {
      fontFamily: 'Inter',
      baseFontSizePx: 16,
      scale: {
        sm: { sizeRem: 0.875, lineHeight: 1.4 },
        base: { sizeRem: 1, lineHeight: 1.6 },
        lg: { sizeRem: 1.125, lineHeight: 1.6 },
        xl: { sizeRem: 1.25, lineHeight: 1.6 },
      }
    }
  } as unknown as ThemeConfig;

  it('should emit tokens correctly', () => {
    const tokens = typographyCompilerEntry.emitTokens(baseConfig);
    expect(tokens).toContain('--font-family: Inter');
    expect(tokens).toContain('--text-base-size: 1rem');
  });

  it('should emit utilities correctly', () => {
    const utils = typographyCompilerEntry.emitUtilities();
    expect(utils).toContain('.text-sm {');
    expect(utils).toContain('font-size: var(--text-sm-size)');
  });
});

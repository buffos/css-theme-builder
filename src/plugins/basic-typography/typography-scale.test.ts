import { describe, it, expect } from 'vitest';

import type { ThemeConfig } from '../../compiler/types';

import { typographyCompilerEntry } from './index';

describe('Typography Scale Presets', () => {
  it('should calculate modular scale correctly for Perfect Fourth (1.333)', () => {
    const config = {
      typography: {
        fontFamily: 'Inter',
        baseFontSizePx: 16,
        scaleMode: 'modular',
        ratio: 1.333,
        scale: {
          sm: { sizeRem: 0.75, lineHeight: 1.4 },
          base: { sizeRem: 1, lineHeight: 1.6 },
          lg: { sizeRem: 1.333, lineHeight: 1.6 },
          xl: { sizeRem: 1.777, lineHeight: 1.6 },
        }
      }
    } as unknown as ThemeConfig;

    const tokens = typographyCompilerEntry.emitTokens(config);
    expect(tokens).toContain('--text-sm-size: 0.75rem');
    expect(tokens).toContain('--text-base-size: 1rem');
    expect(tokens).toContain('--text-lg-size: 1.333rem');
    expect(tokens).toContain('--text-xl-size: 1.777rem');
  });

  it('should calculate modular scale correctly for Golden Ratio (1.618)', () => {
    const config = {
      typography: {
        fontFamily: 'Inter',
        baseFontSizePx: 16,
        scaleMode: 'modular',
        ratio: 1.618,
        scale: {
          sm: { sizeRem: 0.618, lineHeight: 1.4 },
          base: { sizeRem: 1, lineHeight: 1.6 },
          lg: { sizeRem: 1.618, lineHeight: 1.6 },
          xl: { sizeRem: 2.618, lineHeight: 1.6 },
        }
      }
    } as unknown as ThemeConfig;

    const tokens = typographyCompilerEntry.emitTokens(config);
    expect(tokens).toContain('--text-sm-size: 0.618rem');
    expect(tokens).toContain('--text-lg-size: 1.618rem');
  });
});

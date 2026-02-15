import { describe, it, expect } from 'vitest';

import type { ThemeConfig } from '../../compiler/types';
import { colorsCompilerEntry } from './index';

describe('Colors Plugin', () => {
  const baseConfig = {
    colors: {
      primary: { 500: '#5b8def', 600: '#3f6ad8' },
      neutral: { 50: '#ffffff', 900: '#000000' },
    },
    surface: { card: '#ffffff' }
  } as unknown as ThemeConfig;

  it('should emit correct tokens for light mode', () => {
    const tokens = colorsCompilerEntry.emitTokens(baseConfig);
    expect(tokens).toContain('--color-primary-500: #5b8def');
    expect(tokens).toContain('--on-primary: #f8fbff'); // primary (blueish) on light should pick light text if low luminance
  });

  it('should emit correct tokens for dark mode', () => {
    const configWithDarkSurface = {
      ...baseConfig,
      surface: { darkCardSnippet: '#0f1729' }
    } as unknown as ThemeConfig;
    
    // We test emitDarkTokens directly
    const tokens = colorsCompilerEntry.emitDarkTokens(configWithDarkSurface);
    expect(tokens).toContain('--on-surface: #f8fbff'); // dark surface should pick light text
  });
});

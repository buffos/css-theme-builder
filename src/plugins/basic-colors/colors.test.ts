import { describe, it, expect } from 'vitest';

import type { ThemeConfig } from '../../compiler/types';

import { colorsCompilerEntry } from './index';

describe('Colors Plugin', () => {
  const baseConfig = {
    colors: {
      primary: { 500: '#5b8def', 600: '#3f6ad8' },
      neutral: { 50: '#ffffff', 900: '#000000' },
    },
  } as unknown as ThemeConfig;

  it('should emit correct tokens for light mode', () => {
    const tokens = colorsCompilerEntry.emitTokens(baseConfig);
    expect(tokens).toContain('--color-primary-500: #5b8def');
  });

  it('should handle missing colors gracefully', () => {
    const tokens = colorsCompilerEntry.emitTokens({} as ThemeConfig);
    expect(tokens).toBe('');
  });
});

import { describe, it, expect } from 'vitest';

import type { ThemeConfig } from '../../compiler/types';

import { surfaceCompilerEntry } from './index';

describe('Surface Plugin', () => {
  const baseConfig = {
    surface: {
      background: '#ffffff',
      onBackground: '#000000',
      card: '#f0f0f0',
      onCard: '#111111',
      darkBackground: '#111111',
      darkOnBackground: '#eeeeee',
      darkCard: '#222222',
      darkOnCard: '#ffffff',
    }
  } as unknown as ThemeConfig;

  it('should emit correct light mode tokens', () => {
    const tokens = surfaceCompilerEntry.emitTokens(baseConfig);
    expect(tokens).toContain('--surface-bg: #ffffff');
    expect(tokens).toContain('--on-background: #000000');
    expect(tokens).toContain('--surface-card: #f0f0f0');
    expect(tokens).toContain('--on-card: #111111');
  });

  it('should emit correct dark mode tokens', () => {
    const tokens = surfaceCompilerEntry.emitDarkTokens(baseConfig);
    expect(tokens).toContain('--surface-bg: #111111');
    expect(tokens).toContain('--on-background: #eeeeee');
    expect(tokens).toContain('--surface-card: #222222');
    expect(tokens).toContain('--on-card: #ffffff');
  });
});

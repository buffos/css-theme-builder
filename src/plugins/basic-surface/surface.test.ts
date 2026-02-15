import { describe, it, expect } from 'vitest';

import type { ThemeConfig } from '../../compiler/types';
import { surfaceCompilerEntry } from './index';

describe('Surface Plugin', () => {
  const baseConfig = {
    surface: {
      background: '#ffffff',
      foreground: '#000000',
      card: '#f0f0f0',
      darkBackgroundSnippet: '#111111',
      darkForegroundSnippet: '#eeeeee',
      darkCardSnippet: '#222222',
    }
  } as unknown as ThemeConfig;

  it('should emit correct light mode tokens', () => {
    const tokens = surfaceCompilerEntry.emitTokens(baseConfig);
    expect(tokens).toContain('--surface-bg: #ffffff');
    expect(tokens).toContain('--surface-fg: #000000');
  });

  it('should emit correct dark mode tokens', () => {
    const tokens = surfaceCompilerEntry.emitDarkTokens(baseConfig);
    expect(tokens).toContain('--surface-bg: #111111');
    expect(tokens).toContain('--surface-fg: #eeeeee');
  });
});

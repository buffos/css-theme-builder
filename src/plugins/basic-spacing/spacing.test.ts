import { describe, it, expect } from 'vitest';

import type { ThemeConfig } from '../../compiler/types';
import { spacingCompilerEntry, generateSpacingTokens } from './index';

describe('Spacing Scale Generator', () => {
  it('should generate tokens correctly for 4px base', () => {
    const tokens = generateSpacingTokens(4);
    expect(tokens['1']).toBe('0.25rem');
    expect(tokens['2']).toBe('0.5rem');
    expect(tokens['4']).toBe('1rem');
    expect(tokens['0.5']).toBe('0.125rem');
  });

  it('should generate tokens correctly for 5px base', () => {
    const tokens = generateSpacingTokens(5);
    expect(tokens['1']).toBe('0.3125rem');
    expect(tokens['4']).toBe('1.25rem');
  });

  it('should emit tokens and utilities', () => {
    const config = {
      spacing: {
        baseUnitPx: 4,
        scaleMode: 'generated',
        tokens: generateSpacingTokens(4),
      }
    } as unknown as ThemeConfig;

    const tokenCss = spacingCompilerEntry.emitTokens(config);
    expect(tokenCss).toContain('--space-1: 0.25rem');
    expect(tokenCss).toContain('--space-4: 1rem');

    const utilCss = spacingCompilerEntry.emitUtilities(config);
    expect(utilCss).toContain('.p-1 { padding: var(--space-1); }');
    expect(utilCss).toContain('.p-0_5 { padding: var(--space-0.5); }');
    expect(utilCss).toContain('.gap-2 { gap: var(--space-2); }');
  });
});

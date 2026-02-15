import { describe, it, expect } from 'vitest';

import type { ThemeConfig } from '../../compiler/types';

import { buttonsCompilerEntry } from './index';

describe('Buttons Component Overrides', () => {
  it('should emit default variables when no overrides present', () => {
    const config = {
      buttons: {},
      radius: { '1': '8px' }
    } as unknown as ThemeConfig;

    const css = buttonsCompilerEntry.emitComponents(config);
    expect(css).toContain('--btn-radius: var(--radius-1, var(--radius-1, 8px));');
  });

  it('should emit override values when present', () => {
    const config = {
      buttons: {
        overrides: {
          bg: '#ff0000',
          radius: '50%'
        }
      },
      radius: { '1': '8px' }
    } as unknown as ThemeConfig;

    const css = buttonsCompilerEntry.emitComponents(config);
    expect(css).toContain('--btn-bg: #ff0000;');
    expect(css).toContain('--btn-radius: 50%;');
  });
});

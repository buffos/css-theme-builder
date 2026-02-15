import { describe, it, expect } from 'vitest';

import { compile } from './compile';
import type { ThemeConfig } from './types';

describe('Compiler Core', () => {
  const baseConfig = {
    name: 'Test Theme',
    mode: 'light',
    colors: {
      primary: { 500: '#ff0000', 600: '#cc0000' },
      neutral: { 50: '#ffffff', 900: '#000000' },
    },
    surface: {
      background: '#ffffff',
      foreground: '#000000',
      card: '#f0f0f0',
      darkBackgroundSnippet: '#111111',
      darkForegroundSnippet: '#eeeeee',
      darkCardSnippet: '#222222',
    }
  } as unknown as ThemeConfig;

  it('should compile light mode tokens correctly', () => {
    const outputs = compile({ ...baseConfig, mode: 'light' });
    expect(outputs['tokens.css']).toContain('--color-primary-500: #ff0000');
    expect(outputs['tokens.css']).toContain('--surface-bg: #ffffff');
    expect(outputs['tokens.css']).not.toContain('@media (prefers-color-scheme: dark)');
  });

  it('should compile dark mode tokens correctly', () => {
    const outputs = compile({ ...baseConfig, mode: 'dark' });
    // In dark mode, surface-bg should be the dark variant
    expect(outputs['tokens.css']).toContain('--surface-bg: #111111');
  });

  it('should compile light-dark tokens with media queries and data-theme', () => {
    const outputs = compile({ ...baseConfig, mode: 'light-dark' });
    expect(outputs['tokens.css']).toContain('--surface-bg: #ffffff');
    expect(outputs['tokens.css']).toContain('@media (prefers-color-scheme: dark)');
    expect(outputs['tokens.css']).toContain('[data-theme=\'dark\']');
    expect(outputs['tokens.css']).toContain('--surface-bg: #111111');
  });

  it('should include index.css with imports', () => {
    const outputs = compile(baseConfig);
    expect(outputs['index.css']).toContain('@import url(\'./tokens.css\');');
    expect(outputs['index.css']).toContain('@import url(\'./utilities.css\');');
    expect(outputs['index.css']).toContain('@import url(\'./components.css\');');
  });
});

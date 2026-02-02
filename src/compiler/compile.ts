import { emitComponents } from './emit-components';
import { emitTokens } from './emit-tokens';
import { emitUtilities } from './emit-utilities';
import type { ThemeConfig } from './types';

export type CompiledFiles = Record<string, string>;

/**
 * compile transforms a ThemeConfig into the four CSS files:
 * - tokens.css
 * - utilities.css
 * - components.css
 * - index.css (imports above in order)
 *
 * TODO: replace placeholders with real emitters.
 */
export const compile = (config: ThemeConfig): CompiledFiles => {
  const tokens = emitTokens(config);
  const utilities = emitUtilities(config);
  const components = emitComponents(config);
  const index = [
    `@import url('./tokens.css');`,
    `@import url('./utilities.css');`,
    `@import url('./components.css');`,
  ].join('\n');

  return {
    'tokens.css': tokens,
    'utilities.css': utilities,
    'components.css': components,
    'index.css': index,
  };
};

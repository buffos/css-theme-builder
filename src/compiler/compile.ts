import { compilerRegistry } from './registry';
import type { ThemeConfig } from './types';

export type CompiledFiles = Record<string, string>;

/**
 * compile transforms a ThemeConfig into the four CSS files:
 * - tokens.css
 * - utilities.css
 * - components.css
 * - index.css (imports above in order)
 */
export const compile = (config: ThemeConfig): CompiledFiles => {
  const tokenChunks: string[] = [];
  const utilityChunks: string[] = [];
  const componentChunks: string[] = [];

  compilerRegistry.forEach((entry) => {
    if (!entry.isEnabled(config)) return;
    const tokensOut = entry.emitTokens?.(config);
    if (tokensOut) tokenChunks.push(tokensOut);
    const utilitiesOut = entry.emitUtilities?.(config);
    if (utilitiesOut) utilityChunks.push(utilitiesOut);
    const componentsOut = entry.emitComponents?.(config);
    if (componentsOut) componentChunks.push(componentsOut);
  });

  const tokens = tokenChunks.filter(Boolean).join('\n\n');
  const utilities = utilityChunks.filter(Boolean).join('\n\n');
  const components = componentChunks.filter(Boolean).join('\n\n');
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

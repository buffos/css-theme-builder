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
  const lightChunks: string[] = [];
  const darkChunks: string[] = [];
  const utilityChunks: string[] = [];
  const componentChunks: string[] = [];

  compilerRegistry.forEach((entry) => {
    if (!entry.isEnabled(config)) return;

    // Light/Default tokens
    const tokensOut = entry.emitTokens?.(config);
    if (tokensOut) lightChunks.push(tokensOut);

    // Dark overrides
    const darkOut = entry.emitDarkTokens?.(config);
    if (darkOut) darkChunks.push(darkOut);

    const utilitiesOut = entry.emitUtilities?.(config);
    if (utilitiesOut) utilityChunks.push(utilitiesOut);
    const componentsOut = entry.emitComponents?.(config);
    if (componentsOut) componentChunks.push(componentsOut);
  });

  let tokens = '';

  if (config.mode === 'dark') {
    // In dark-only mode, we emit dark tokens as default if they exist, otherwise light.
    // Actually, usually you want dark tokens to override :root.
    const darkCombined = darkChunks.filter(Boolean).join('\n');
    if (darkCombined) {
      tokens = darkCombined;
    } else {
      tokens = lightChunks.filter(Boolean).join('\n');
    }
  } else if (config.mode === 'light') {
    tokens = lightChunks.filter(Boolean).join('\n');
  } else {
    // light-dark or system
    const light = lightChunks.filter(Boolean).join('\n');
    const dark = darkChunks.filter(Boolean).join('\n');

    tokens = light;
    if (dark) {
      tokens += `\n\n@media (prefers-color-scheme: dark) {\n${dark}\n}`;
      tokens += `\n\n[data-theme='dark'] {\n${dark}\n}`;
    }
  }

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

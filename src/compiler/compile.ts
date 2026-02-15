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
    if (tokensOut) lightChunks.push(tokensOut.trim());

    // Dark overrides
    const darkOut = entry.emitDarkTokens?.(config);
    if (darkOut) darkChunks.push(darkOut.trim());

    const utilitiesOut = entry.emitUtilities?.(config);
    if (utilitiesOut) utilityChunks.push(utilitiesOut);
    const componentsOut = entry.emitComponents?.(config);
    if (componentsOut) componentChunks.push(componentsOut);
  });

  const wrapInRoot = (content: string) => content ? `:root {\n${content}\n}` : '';
  const wrapInDark = (content: string) => content ? `[data-theme='dark'] {\n${content}\n}` : '';
  const wrapInDarkMedia = (content: string) => content ? `@media (prefers-color-scheme: dark) {\n  :root {\n${content.split('\n').map(l => `    ${l}`).join('\n')}\n  }\n}` : '';

  let tokens = '';
  const lightContent = lightChunks.filter(Boolean).join('\n');
  const darkContent = darkChunks.filter(Boolean).join('\n');

  if (config.mode === 'dark') {
    // In dark mode, we emit light tokens first (as fallback), then dark tokens as overrides on :root
    tokens = [wrapInRoot(lightContent), wrapInRoot(darkContent)].filter(Boolean).join('\n\n');
  } else if (config.mode === 'light') {
    tokens = wrapInRoot(lightContent);
  } else {
    // light-dark
    tokens = wrapInRoot(lightContent);
    if (darkContent) {
      tokens += `\n\n${wrapInDarkMedia(darkContent)}`;
      tokens += `\n\n${wrapInDark(darkContent)}`;
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

import type { ThemeConfig } from './types';

export const emitTokens = (config: ThemeConfig): string => {
  // TODO: generate CSS custom properties for tokens.
  return `/* tokens for ${config.name} */`;
};

import { colorsCompilerEntry } from '../plugins/basic-colors';
import { radiusCompilerEntry } from '../plugins/basic-radius';
import { shadowCompilerEntry } from '../plugins/basic-shadow';
import { spacingCompilerEntry } from '../plugins/basic-spacing';
import { surfaceCompilerEntry } from '../plugins/basic-surface';
import { typographyCompilerEntry } from '../plugins/basic-typography';

import type { ThemeConfig, ThemeModules } from './types';

type EmitterEntry = {
  id: keyof ThemeModules;
  title: string;
  isEnabled: (config: ThemeConfig) => boolean;
  emitTokens?: (config: ThemeConfig) => string;
  emitUtilities?: (config: ThemeConfig) => string;
  emitComponents?: (config: ThemeConfig) => string;
};

export const compilerRegistry: EmitterEntry[] = [
  colorsCompilerEntry,
  surfaceCompilerEntry,
  typographyCompilerEntry,
  spacingCompilerEntry,
  radiusCompilerEntry,
  shadowCompilerEntry,
];

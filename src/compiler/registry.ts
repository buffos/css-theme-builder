import { alertCompilerEntry } from '../plugins/basic-alert';
import { buttonsCompilerEntry } from '../plugins/basic-buttons';
import { cardCompilerEntry } from '../plugins/basic-card';
import { colorsCompilerEntry } from '../plugins/basic-colors/index';
import { elevationCompilerEntry } from '../plugins/basic-elevation';
import { inputsCompilerEntry } from '../plugins/basic-inputs';
import { layoutCompilerEntry } from '../plugins/basic-layout';
import { modalCompilerEntry } from '../plugins/basic-modal';
import { motionCompilerEntry } from '../plugins/basic-motion';
import { radiusCompilerEntry } from '../plugins/basic-radius';
import { shadowCompilerEntry } from '../plugins/basic-shadow';
import { spacingCompilerEntry } from '../plugins/basic-spacing';
import { surfaceCompilerEntry } from '../plugins/basic-surface';
import { tableCompilerEntry } from '../plugins/basic-table';
import { typographyCompilerEntry } from '../plugins/basic-typography';

import type { ThemeConfig, ThemeModules } from './types';

type EmitterEntry = {
  id: keyof ThemeModules;
  title: string;
  isEnabled: (config: ThemeConfig) => boolean;
  emitTokens?: (config: ThemeConfig) => string;
  emitDarkTokens?: (config: ThemeConfig) => string;
  emitUtilities?: (config: ThemeConfig) => string;
  emitComponents?: (config: ThemeConfig) => string;
};

export const compilerRegistry: EmitterEntry[] = [
  layoutCompilerEntry,
  typographyCompilerEntry,
  colorsCompilerEntry,
  surfaceCompilerEntry,
  spacingCompilerEntry,
  radiusCompilerEntry,
  shadowCompilerEntry,
  elevationCompilerEntry,
  buttonsCompilerEntry,
  inputsCompilerEntry,
  cardCompilerEntry,
  alertCompilerEntry,
  tableCompilerEntry,
  modalCompilerEntry,
  motionCompilerEntry,
];

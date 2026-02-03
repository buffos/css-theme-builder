import type { ThemeConfig } from '../compiler/types';
import { alertDefaults } from '../plugins/basic-alert';
import { buttonsDefaults } from '../plugins/basic-buttons';
import { cardDefaults } from '../plugins/basic-card';
import { colorsDefaults } from '../plugins/basic-colors';
import { inputsDefaults } from '../plugins/basic-inputs';
import { modalDefaults } from '../plugins/basic-modal';
import { radiusDefaults } from '../plugins/basic-radius';
import { shadowDefaults } from '../plugins/basic-shadow';
import { spacingDefaults } from '../plugins/basic-spacing';
import { surfaceDefaults } from '../plugins/basic-surface';
import { tableDefaults } from '../plugins/basic-table';
import { typographyDefaults } from '../plugins/basic-typography';

export type ThemeMode = ThemeConfig['mode'];

type StateListener = (config: ThemeConfig) => void;

const initialConfig = {
  name: 'Aurora',
  mode: 'light-dark',
  ...colorsDefaults,
  ...surfaceDefaults,
  ...typographyDefaults,
  ...spacingDefaults,
  ...radiusDefaults,
  ...shadowDefaults,
  ...alertDefaults,
  ...buttonsDefaults,
  ...cardDefaults,
  ...inputsDefaults,
  ...modalDefaults,
  ...tableDefaults,
} as ThemeConfig;

let config: ThemeConfig = initialConfig;
const listeners = new Set<StateListener>();

export const getConfig = (): ThemeConfig => config;

export const setConfig = (next: ThemeConfig): void => {
  config = { ...next };
  listeners.forEach((listener) => listener(config));
};

export const updateConfig = (mutator: (current: ThemeConfig) => ThemeConfig): void => {
  setConfig(mutator(config));
};

export const subscribe = (listener: StateListener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getInitialConfig = (): ThemeConfig => initialConfig;

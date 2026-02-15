import { buildThemeConfig, type ThemeConfig, type PartialThemeConfig } from '../compiler/types';
import { alertDefaults } from '../plugins/basic-alert';
import { buttonsDefaults } from '../plugins/basic-buttons';
import { cardDefaults } from '../plugins/basic-card';
import { colorsDefaults } from '../plugins/basic-colors';
import { inputsDefaults } from '../plugins/basic-inputs';
import { layoutDefaults } from '../plugins/basic-layout';
import { modalDefaults } from '../plugins/basic-modal';
import { motionDefaults } from '../plugins/basic-motion';
import { radiusDefaults } from '../plugins/basic-radius';
import { sandboxDefaults } from '../plugins/basic-sandbox';
import { shadowDefaults } from '../plugins/basic-shadow';
import { spacingDefaults } from '../plugins/basic-spacing';
import { surfaceDefaults } from '../plugins/basic-surface';
import { tableDefaults } from '../plugins/basic-table';
import { typographyDefaults } from '../plugins/basic-typography';

export type ThemeMode = ThemeConfig['mode'];

type StateListener = (config: ThemeConfig) => void;

const defaultFragments: PartialThemeConfig[] = [
  colorsDefaults,
  surfaceDefaults,
  typographyDefaults,
  spacingDefaults,
  radiusDefaults,
  sandboxDefaults,
  shadowDefaults,
  alertDefaults,
  buttonsDefaults,
  cardDefaults,
  inputsDefaults,
  modalDefaults,
  layoutDefaults,
  motionDefaults,
  tableDefaults,
];

const initialConfig: ThemeConfig = buildThemeConfig(
  { name: 'Aurora', mode: 'light-dark' },
  defaultFragments
);

let config: ThemeConfig = initialConfig;
const listeners = new Set<StateListener>();
const historyListeners = new Set<(canUndo: boolean, canRedo: boolean) => void>();

const past: ThemeConfig[] = [];
const future: ThemeConfig[] = [];
const MAX_HISTORY = 50;
const STORAGE_KEY = 'css-theme-builder-config';

const saveToLocalStorage = (cfg: ThemeConfig) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
};

const notifyListeners = () => {
  listeners.forEach((listener) => listener(config));
  historyListeners.forEach((listener) => listener(past.length > 0, future.length > 0));
};

export const getConfig = (): ThemeConfig => config;

export const setConfig = (next: ThemeConfig, skipHistory = false): void => {
  if (!skipHistory) {
    past.push({ ...config });
    if (past.length > MAX_HISTORY) past.shift();
    future.length = 0; // Clear future on new action
  }

  config = { ...next };
  saveToLocalStorage(config);
  notifyListeners();
};

export const updateConfig = (mutator: (current: ThemeConfig) => ThemeConfig): void => {
  setConfig(mutator(config));
};

export const undo = (): void => {
  if (past.length === 0) return;
  const previous = past.pop()!;
  future.push({ ...config });
  config = previous;
  saveToLocalStorage(config);
  notifyListeners();
};

export const redo = (): void => {
  if (future.length === 0) return;
  const next = future.pop()!;
  past.push({ ...config });
  config = next;
  saveToLocalStorage(config);
  notifyListeners();
};

export const subscribe = (listener: StateListener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const subscribeHistory = (
  listener: (canUndo: boolean, canRedo: boolean) => void
): (() => void) => {
  historyListeners.add(listener);
  listener(past.length > 0, future.length > 0);
  return () => historyListeners.delete(listener);
};

export const getInitialConfig = (): ThemeConfig => initialConfig;

// Initialize from localStorage
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const savedConfig = JSON.parse(saved) as PartialThemeConfig;
    config = buildThemeConfig(savedConfig, defaultFragments);
  }
} catch (err) {
  console.error('Failed to load from localStorage:', err);
}

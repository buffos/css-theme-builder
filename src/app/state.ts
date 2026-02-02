import type { ThemeConfig } from '../compiler/types';

export type ThemeMode = ThemeConfig['mode'];

type StateListener = (config: ThemeConfig) => void;

const initialConfig = {
  name: 'Aurora',
  mode: 'light-dark',
  colors: {
    primary: { 500: '#5b8def', 600: '#3f6ad8' },
    neutral: { 50: '#f7f9fc', 900: '#0f172a' },
    danger: { 500: '#f05656' },
  },
  surface: {
    background: '#0b1021',
    foreground: '#e7ecff',
    card: '#0f1729',
  },
  typography: {
    fontFamily: 'Inter, "Segoe UI", system-ui, -apple-system, sans-serif',
    baseFontSizePx: 16,
    scale: {
      sm: { sizeRem: 0.875, lineHeight: 1.4 },
      base: { sizeRem: 1, lineHeight: 1.6 },
      lg: { sizeRem: 1.125, lineHeight: 1.6 },
      xl: { sizeRem: 1.25, lineHeight: 1.6 },
    },
  },
  spacing: { 1: '0.25rem', 2: '0.5rem', 4: '1rem', 6: '1.5rem' },
  radius: { 1: '8px', 2: '12px' },
  shadow: {
    1: '0 1px 3px rgba(0,0,0,0.15)',
    2: '0 10px 30px rgba(0,0,0,0.25)',
  },
} satisfies ThemeConfig;

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

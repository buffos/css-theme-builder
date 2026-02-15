import type { ThemeConfig } from '../compiler/types';

export type ControlModule = {
  id: string;
  title: string;
  mount: (container: HTMLElement, api: ControlApi) => (() => void) | void;
  unmount?: () => void;
};

// decoupling state from controls
export type ControlApi = {
  getConfig: () => ThemeConfig;
  updateConfig: (mutator: (current: ThemeConfig) => ThemeConfig) => void;
  subscribe: (listener: (config: ThemeConfig) => void) => () => void;
  setActivePreview: (ids: string[]) => void;
};

export type ControlsRegistry = Record<string, ControlModule>;

export const defineControlsRegistry = (registry: ControlsRegistry): ControlsRegistry => registry;

export const controlsRegistry: ControlsRegistry = {};

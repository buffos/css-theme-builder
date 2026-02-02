// Shared types for compiler modules and registries.

export type ThemeMode = 'light-dark' | 'light' | 'dark' | 'system';

// Section shapes (extensible via module augmentation).
export type ThemeModules = {
  colors: {
    primary: { 500: string; 600: string };
    neutral: { 50: string; 900: string };
    danger?: { 500: string };
  };
  surface: {
    background: string;
    foreground: string;
    card: string;
  };
  typography: {
    fontFamily: string;
    baseFontSizePx: number;
    scale: {
      sm: { sizeRem: number; lineHeight: number };
      base: { sizeRem: number; lineHeight: number };
      lg: { sizeRem: number; lineHeight: number };
      xl: { sizeRem: number; lineHeight: number };
    };
  };
  spacing: Record<string, string>;
  radius: Record<string, string>;
  shadow: Record<string, string>;
};

// Generic ThemeConfig derived from registered sections.
export type ThemeConfig<M extends ThemeModules = ThemeModules> = {
  name: string;
  mode: ThemeMode;
} & {
  [K in keyof M]: M[K];
};

// Section spec used to build compiler registries.
export type ThemeSectionSpec<K extends string, TSection> = {
  id: K;
  title: string;
  description?: string;
  validate: (section: unknown) => section is TSection;
  emitTokens?: (section: TSection) => Record<string, string>;
  emitUtilities?: (section: TSection) => Record<string, string>;
  emitComponents?: (section: TSection) => Record<string, string>;
};

export type SectionRegistry<M extends ThemeModules = ThemeModules> = {
  [K in keyof M]: ThemeSectionSpec<K & string, M[K]>;
};

// Helper to keep registry definitions type-safe.
export const defineRegistry = <M extends ThemeModules>(registry: SectionRegistry<M>) =>
  registry;

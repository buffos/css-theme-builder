// Shared types for compiler modules and registries.

export type ThemeMode = 'light-dark' | 'light' | 'dark' | 'system';

// Section shapes are provided entirely by plugin module augmentation.
export interface ThemeModules {} //  eslint-disable-line

// Generic ThemeConfig derived from registered sections.
export type ThemeConfig<M extends ThemeModules = ThemeModules> = {
  name: string;
  version: string;
  author: string;
  mode: ThemeMode;
} & {
  [K in keyof M]: M[K];
};

export type PartialThemeConfig<M extends ThemeModules = ThemeModules> = Partial<{
  name: string;
  version: string;
  author: string;
  mode: ThemeMode;
}> &
  Partial<{
    [K in keyof M]: M[K];
  }>;

/**
 * Build a config object starting from name/mode and layering plugin-provided defaults.
 * Callers are responsible for supplying enough fragments to satisfy all required sections.
 */
export const buildThemeConfig = <M extends ThemeModules>(
  base: PartialThemeConfig<M> = {},
  fragments: PartialThemeConfig<M>[] = []
): ThemeConfig<M> => {
  const merged = Object.assign(
    {
      name: 'My Theme',
      version: '1.0.0',
      author: 'Unknown',
      mode: 'light-dark' as ThemeMode,
    },
    base,
    ...fragments
  ) as ThemeConfig<M>;
  return merged;
};

// Section spec used to build compiler registries.
export type ThemeSectionSpec<K extends string, TSection> = {
  id: K;
  title: string;
  description?: string;
  validate: (section: unknown) => section is TSection;
  emitTokens?: (section: TSection) => string;
  emitDarkTokens?: (section: TSection) => string;
  emitUtilities?: (section: TSection) => string;
  emitComponents?: (section: TSection) => string;
};

export type SectionRegistry<M extends ThemeModules = ThemeModules> = {
  [K in keyof M]: ThemeSectionSpec<K & string, M[K]>;
};

// Helper to keep registry definitions type-safe.
export const defineRegistry = <M extends ThemeModules>(registry: SectionRegistry<M>) => registry;

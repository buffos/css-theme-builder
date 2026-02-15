import type { PartialThemeConfig } from '../../compiler/types';
import { generateScale } from '../../utils/colors';

export const THEME_PRESETS: Record<string, PartialThemeConfig> = {
  aurora: {
    name: 'Aurora',
    colors: {
      primary: generateScale('#3b82f6'),
      secondary: generateScale('#10b981'),
      tertiary: generateScale('#8b5cf6'),
      neutral: generateScale('#f8fafc'),
      tuning: {
        tintStrength: 60,
        darkDepth: 25,
        lightDepth: 92,
        hueOffset: 0,
      },
      paletteMode: 'analogous',
    },
    radius: { sm: '4px', md: '8px', lg: '16px' },
    motion: {
      durations: { fast: 150, base: 300, slow: 500 },
      easing: { in: 'ease-in', out: 'ease-out', inOut: 'ease-in-out' }
    }
  },
  midnight: {
    name: 'Midnight Pro',
    colors: {
      primary: generateScale('#7c4dff'),
      secondary: generateScale('#448aff'),
      tertiary: generateScale('#b388ff'),
      neutral: generateScale('#0a0b10'),
      tuning: {
        tintStrength: 40,
        darkDepth: 12,
        lightDepth: 95,
        hueOffset: 0,
      },
      paletteMode: 'analogous',
    },
    radius: { sm: '6px', md: '12px', lg: '24px' },
    motion: {
      durations: { fast: 120, base: 250, slow: 450 },
      easing: {
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }
    }
  },
  cyberpunk: {
    name: 'Cyberpunk',
    colors: {
      primary: generateScale('#ff00cc'),
      secondary: generateScale('#00fbff'),
      tertiary: generateScale('#ffff00'),
      neutral: generateScale('#050505'),
      tuning: {
        tintStrength: 80,
        darkDepth: 5,
        lightDepth: 90,
        hueOffset: 0,
      },
      paletteMode: 'complementary',
    },
    radius: { sm: '0px', md: '0px', lg: '0px' },
    motion: {
      durations: { fast: 80, base: 150, slow: 300 },
      easing: {
        in: 'steps(4, end)',
        out: 'steps(4, start)',
        inOut: 'cubic-bezier(1, 0, 0, 1)',
      }
    }
  },
  corporate: {
    name: 'Corporate Clean',
    colors: {
      primary: generateScale('#0052cc'),
      secondary: generateScale('#0747a6'),
      tertiary: generateScale('#2684ff'),
      neutral: generateScale('#f4f5f7'),
      tuning: {
        tintStrength: 10,
        darkDepth: 25,
        lightDepth: 92,
        hueOffset: 0,
      },
      paletteMode: 'analogous',
    },
    radius: { sm: '2px', md: '4px', lg: '8px' },
  },
  minimalist: {
    name: 'Minimalist',
    colors: {
      primary: generateScale('#171717'),
      secondary: generateScale('#404040'),
      tertiary: generateScale('#737373'),
      neutral: generateScale('#ffffff'),
      tuning: {
        tintStrength: 0,
        darkDepth: 20,
        lightDepth: 100,
        hueOffset: 0,
      },
      paletteMode: 'manual',
    },
    radius: { sm: '8px', md: '16px', lg: '32px' },
  }
};

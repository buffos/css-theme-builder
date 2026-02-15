/**
 * Computes the relative luminance of a color.
 * Based on WCAG 2.1 formula.
 */
export const getLuminance = (hex: string): number => {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return 0;

  const num = Number.parseInt(clean, 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;

  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};

/**
 * Calculates the contrast ratio between two colors.
 */
export const getContrastRatio = (c1: string, c2: string): number => {
  const l1 = getLuminance(c1);
  const l2 = getLuminance(c2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Returns the WCAG level for a given contrast ratio.
 */
export const getWCAGLevel = (ratio: number): 'AAA' | 'AA' | 'Large AA' | 'Fail' => {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'Large AA';
  return 'Fail';
};

/**
 * Returns the best text color (black or white) for a given background.
 */
export const getOnColor = (bg: string): string => (getLuminance(bg) > 0.6 ? '#0b1021' : '#f8fbff');

/**
 * HEX to HSL conversion.
 */
export const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return { h: 0, s: 0, l: 0.5 };
  const num = Number.parseInt(clean, 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0, l };
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  switch (max) {
    case r: h = ((g - b) / d) % 6; break;
    case g: h = (b - r) / d + 2; break;
    default: h = (r - g) / d + 4;
  }
  h *= 60;
  if (h < 0) h += 360;
  return { h, s, l };
};

/**
 * HSL to HEX conversion.
 */
export const hslToHex = (h: number, s: number, l: number): string => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r1 = 0, g1 = 0, b1 = 0;
  if (h < 60) [r1, g1, b1] = [c, x, 0];
  else if (h < 120) [r1, g1, b1] = [x, c, 0];
  else if (h < 180) [r1, g1, b1] = [0, c, x];
  else if (h < 240) [r1, g1, b1] = [0, x, c];
  else if (h < 300) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r1)}${toHex(g1)}${toHex(b1)}`;
};

/**
 * Nudges a color's lightness until it meets a target contrast ratio.
 */
export const nudgeContrast = (hex: string, onColor: string, targetRatio = 4.5): string => {
  const { h, s } = hexToHsl(hex);
  let { l } = hexToHsl(hex);
  const onL = getLuminance(onColor);
  const isBackgroundDark = onL > 0.5; // If text is dark, we need to lighten the background.
  
  let currentRatio = getContrastRatio(hex, onColor);
  let attempts = 0;

  while (currentRatio < targetRatio && attempts < 100) {
    if (isBackgroundDark) {
      l = Math.min(1, l + 0.01);
    } else {
      l = Math.max(0, l - 0.01);
    }
    hex = hslToHex(h, s, l);
    currentRatio = getContrastRatio(hex, onColor);
    attempts++;
  }

  return hex;
};

/**
 * Generates a full 50-950 color scale (11 steps) from a base hex color.
 * Interpolates lightness and saturation to create a visually balanced ramp.
 */
export const generateScale = (baseHex: string): Record<number, string> => {
  const { h, s, l: baseL } = hexToHsl(baseHex);

  // Targets for lightness at each step
  const targets: Record<number, number> = {
    50: 0.98,
    100: 0.95,
    200: 0.88,
    300: 0.78,
    400: 0.65,
    500: baseL, // Base point
    600: baseL * 0.85,
    700: baseL * 0.7,
    800: baseL * 0.5,
    900: baseL * 0.3,
    950: 0.1,
  };

  const scale: Record<number, string> = {};
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  steps.forEach((step) => {
    let l = targets[step];
    
    // For steps 50-400, we might need to adjust lightness if the base (500) is very light
    if (step < 500 && l <= baseL) {
      // Linearly interpolate between baseL (500) and white (1.0)
      const t = (500 - step) / 500;
      l = baseL + (1 - baseL) * t * 0.9;
    }

    // For steps 600-950, ensure we are darker than base
    if (step > 500 && l >= baseL) {
      const t = (step - 500) / 450;
      l = baseL - baseL * t * 0.9;
    }

    // Adjust saturation slightly: increase in mid-range, decrease in extremes
    let s2 = s;
    if (step < 300) s2 = s * 0.6; // Desaturate highlights
    if (step > 800) s2 = s * 0.8; // Desaturate deep shadows

    scale[step] = hslToHex(h, s2, l);
  });

  return scale;
};

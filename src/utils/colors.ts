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

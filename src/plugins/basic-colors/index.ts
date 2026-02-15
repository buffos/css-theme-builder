import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

type PaletteMode = 'manual' | 'analogous' | 'complementary' | 'triadic';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    colors: {
      primary: { 500: string; 600: string };
      neutral: { 50: string; 900: string };
      danger?: { 500: string };
      success?: { 500: string };
      warning?: { 500: string };
    };
  }
}

export const colorsCompilerEntry = {
  id: 'colors' as const,
  title: 'Colors',
  isEnabled: (config: ThemeConfig) =>
    Boolean(config.colors?.primary?.[500] && config.colors?.neutral?.[50]),
  emitTokens: (config: ThemeConfig) => {
    const colors = config.colors;
    if (!colors) return '';
    const getColor = (val: unknown) => (typeof val === 'string' ? val : undefined);

    const luminance = (hex: string): number => {
      const clean = hex.replace('#', '');
      if (clean.length !== 6) return 0;
      const num = Number.parseInt(clean, 16);
      const r = ((num >> 16) & 255) / 255;
      const g = ((num >> 8) & 255) / 255;
      const b = (num & 255) / 255;
      const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
      const rl = lin(r);
      const gl = lin(g);
      const bl = lin(b);
      return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
    };

    const onColor = (bg: string): string => (luminance(bg) > 0.6 ? '#0b1021' : '#f8fbff');

    const primary500 = getColor(colors.primary?.[500]);
    const primary600 = getColor(colors.primary?.[600]);
    const neutral50 = getColor(colors.neutral?.[50]);
    const neutral900 = getColor(colors.neutral?.[900]);
    const danger500 = getColor(colors.danger?.[500]);
    const success500 = getColor(colors.success?.[500]);
    const warning500 = getColor(colors.warning?.[500]);
    const primaryOn = onColor(primary500 ?? '#5b8def');
    const dangerOn = onColor(danger500 ?? '#f05656');
    const successOn = onColor(success500 ?? '#3ba55a');
    const warningOn = onColor(warning500 ?? '#f29e38');
    const surfaceOn = onColor(config.surface?.card ?? '#ffffff');

    const lines = [
      ':root {',
      `  --color-primary-500: ${primary500 ?? ''};`,
      `  --color-primary-600: ${primary600 ?? ''};`,
      `  --color-neutral-50: ${neutral50 ?? ''};`,
      `  --color-neutral-900: ${neutral900 ?? ''};`,
      `  --on-primary: ${primaryOn};`,
      `  --on-danger: ${dangerOn};`,
      `  --on-success: ${successOn};`,
      `  --on-warning: ${warningOn};`,
      `  --on-surface: ${surfaceOn};`,
    ];
    if (danger500) lines.push(`  --color-danger-500: ${danger500};`);
    if (success500) lines.push(`  --color-success-500: ${success500};`);
    if (warning500) lines.push(`  --color-warning-500: ${warning500};`);
    lines.push('}');
    return lines.join('\n');
  },
  emitDarkTokens: (config: ThemeConfig) => {
    const colors = config.colors;
    if (!colors) return '';
    const getColor = (val: unknown) => (typeof val === 'string' ? val : undefined);

    const luminance = (hex: string): number => {
      const clean = hex.replace('#', '');
      if (clean.length !== 6) return 0;
      const num = Number.parseInt(clean, 16);
      const r = ((num >> 16) & 255) / 255;
      const g = ((num >> 8) & 255) / 255;
      const b = (num & 255) / 255;
      const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
      const rl = lin(r);
      const gl = lin(g);
      const bl = lin(b);
      return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
    };

    const onColor = (bg: string): string => (luminance(bg) > 0.6 ? '#0b1021' : '#f8fbff');

    const primary500 = getColor(colors.primary?.[500]);
    const primary600 = getColor(colors.primary?.[600]);
    const neutral50 = getColor(colors.neutral?.[50]);
    const neutral900 = getColor(colors.neutral?.[900]);
    const danger500 = getColor(colors.danger?.[500]);
    const success500 = getColor(colors.success?.[500]);
    const warning500 = getColor(colors.warning?.[500]);
    const primaryOn = onColor(primary500 ?? '#5b8def');
    const dangerOn = onColor(danger500 ?? '#f05656');
    const successOn = onColor(success500 ?? '#3ba55a');
    const warningOn = onColor(warning500 ?? '#f29e38');
    const surfaceOn = onColor(config.surface?.darkCardSnippet ?? '#0f1729');

    const lines = [
      ':root {',
      `  --color-primary-500: ${primary500 ?? ''};`,
      `  --color-primary-600: ${primary600 ?? ''};`,
      `  --color-neutral-50: ${neutral50 ?? ''};`,
      `  --color-neutral-900: ${neutral900 ?? ''};`,
      `  --on-primary: ${primaryOn};`,
      `  --on-danger: ${dangerOn};`,
      `  --on-success: ${successOn};`,
      `  --on-warning: ${warningOn};`,
      `  --on-surface: ${surfaceOn};`,
    ];
    if (danger500) lines.push(`  --color-danger-500: ${danger500};`);
    if (success500) lines.push(`  --color-success-500: ${success500};`);
    if (warning500) lines.push(`  --color-warning-500: ${warning500};`);
    lines.push('}');
    return lines.join('\n');
  },
  emitUtilities: () =>
    [
      `.bg-primary { background: var(--color-primary-500); }`,
      `.bg-surface { background: var(--surface-bg); color: var(--surface-fg); }`,
      `.text-fg { color: var(--surface-fg); }`,
      `.border-subtle { border: 1px solid var(--color-neutral-900); }`,
    ].join('\n'),
};

export const colorsDefaults = {
  colors: {
    primary: { 500: '#5b8def', 600: '#3f6ad8' },
    neutral: { 50: '#f7f9fc', 900: '#0f172a' },
    danger: { 500: '#f05656' },
    success: { 500: '#3ba55a' },
    warning: { 500: '#f29e38' },
  },
};

// Controls with palette modes and manual overrides.
export const colorsControlModule: ControlModule = {
  id: 'colors',
  title: 'Colors',
  mount: (container, api) => {
    let mode: PaletteMode = 'manual';

    container.innerHTML = `
      <div class="control-group">
        <label for="color-mode">Palette mode</label>
        <select id="color-mode" name="color-mode">
          <option value="manual">Manual</option>
          <option value="analogous">Analogous</option>
          <option value="complementary">Complementary</option>
          <option value="triadic">Triadic</option>
        </select>
      </div>
      <div class="control-grid">
        <div class="control-group">
          <label for="base-color">Base color</label>
          <input id="base-color" name="base-color" type="color" value="#5b8def" />
        </div>
        <div class="control-group">
          <label for="primary-500">Primary 500</label>
          <input id="primary-500" name="primary-500" type="color" />
        </div>
        <div class="control-group">
          <label for="primary-600">Primary 600</label>
          <input id="primary-600" name="primary-600" type="color" />
        </div>
        <div class="control-group">
          <label for="neutral-50">Neutral 50</label>
          <input id="neutral-50" name="neutral-50" type="color" />
        </div>
        <div class="control-group">
          <label for="neutral-900">Neutral 900</label>
          <input id="neutral-900" name="neutral-900" type="color" />
        </div>
        <div class="control-group">
          <label for="danger-500">Danger 500</label>
          <input id="danger-500" name="danger-500" type="color" />
        </div>
        <div class="control-group">
          <label for="success-500">Success 500</label>
          <input id="success-500" name="success-500" type="color" />
        </div>
        <div class="control-group">
          <label for="warning-500">Warning 500</label>
          <input id="warning-500" name="warning-500" type="color" />
        </div>
      </div>
      <p class="controls-placeholder">Pick a mode or fine-tune manually.</p>
    `;

    const modeSelect = container.querySelector<HTMLSelectElement>('#color-mode');
    const baseInput = container.querySelector<HTMLInputElement>('#base-color');
    const p500 = container.querySelector<HTMLInputElement>('#primary-500');
    const p600 = container.querySelector<HTMLInputElement>('#primary-600');
    const n50 = container.querySelector<HTMLInputElement>('#neutral-50');
    const n900 = container.querySelector<HTMLInputElement>('#neutral-900');
    const d500 = container.querySelector<HTMLInputElement>('#danger-500');
    const s500 = container.querySelector<HTMLInputElement>('#success-500');
    const w500 = container.querySelector<HTMLInputElement>('#warning-500');

    const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
      const clean = hex.replace('#', '');
      if (clean.length !== 6) return { h: 0, s: 0, l: 0.5 };
      const num = Number.parseInt(clean, 16);
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      const rn = r / 255;
      const gn = g / 255;
      const bn = b / 255;
      const max = Math.max(rn, gn, bn);
      const min = Math.min(rn, gn, bn);
      const l = (max + min) / 2;
      const d = max - min;
      if (d === 0) return { h: 0, s: 0, l };
      const s = d / (1 - Math.abs(2 * l - 1));
      let h = 0;
      switch (max) {
        case rn:
          h = ((gn - bn) / d) % 6;
          break;
        case gn:
          h = (bn - rn) / d + 2;
          break;
        default:
          h = (rn - gn) / d + 4;
      }
      h *= 60;
      if (h < 0) h += 360;
      return { h, s, l };
    };

    const hueSegment = (h: number, c: number, x: number): [number, number, number] => {
      if (h < 60) return [c, x, 0];
      if (h < 120) return [x, c, 0];
      if (h < 180) return [0, c, x];
      if (h < 240) return [0, x, c];
      if (h < 300) return [x, 0, c];
      return [c, 0, x];
    };

    const hslToHex = (h: number, s: number, l: number): string => {
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = l - c / 2;
      const [r1, g1, b1] = hueSegment(h, c, x);
      const to255 = (v: number) => Math.round((v + m) * 255);
      return `#${[to255(r1), to255(g1), to255(b1)]
        .map((v) => v.toString(16).padStart(2, '0'))
        .join('')}`;
    };

    const shiftHue = (hex: string, delta: number, lAdjust = 0, sAdjust = 0): string => {
      const { h, s, l } = hexToHsl(hex);
      const h2 = (h + delta + 360) % 360;
      const l2 = Math.max(0, Math.min(1, l + lAdjust));
      const s2 = Math.max(0, Math.min(1, s + sAdjust));
      return hslToHex(h2, s2, l2);
    };

    const dangerFromBase = (base: string): string => {
      const { s, l } = hexToHsl(base);
      return hslToHex(5, Math.min(1, s + 0.05), Math.min(1, l + 0.02));
    };

    const generatePalette = (base: string) => {
      switch (mode) {
        case 'analogous':
          return {
            p500: base,
            p600: shiftHue(base, 20, -0.03),
            n50: shiftHue(base, -30, 0.25, -0.25),
            n900: shiftHue(base, 40, -0.3, -0.2),
            d500: dangerFromBase(base),
          };
        case 'complementary':
          return {
            p500: base,
            p600: shiftHue(base, 180, -0.02),
            n50: shiftHue(base, 0, 0.3, -0.3),
            n900: shiftHue(base, 180, -0.25, -0.2),
            d500: dangerFromBase(base),
          };
        case 'triadic':
          return {
            p500: base,
            p600: shiftHue(base, 120, -0.02),
            n50: shiftHue(base, -120, 0.25, -0.25),
            n900: shiftHue(base, 120, -0.25, -0.2),
            d500: dangerFromBase(base),
          };
        default:
          return null;
      }
    };

    const applyPalette = (palette: {
      p500: string;
      p600: string;
      n50: string;
      n900: string;
      d500: string;
    }) => {
      api.updateConfig((cfg) => ({
        ...cfg,
        colors: {
          ...cfg.colors,
          primary: { 500: palette.p500, 600: palette.p600 },
          neutral: { 50: palette.n50, 900: palette.n900 },
          danger: { 500: palette.d500 },
        },
      }));
    };

    const syncInputs = () => {
      const cfg = api.getConfig();
      if (modeSelect) modeSelect.value = mode;
      if (baseInput && cfg.colors?.primary?.[500]) baseInput.value = cfg.colors.primary[500];
      if (p500 && cfg.colors?.primary?.[500]) p500.value = cfg.colors.primary[500];
      if (p600 && cfg.colors?.primary?.[600]) p600.value = cfg.colors.primary[600];
      if (n50 && cfg.colors?.neutral?.[50]) n50.value = cfg.colors.neutral[50];
      if (n900 && cfg.colors?.neutral?.[900]) n900.value = cfg.colors.neutral[900];
      if (d500 && cfg.colors?.danger?.[500]) d500.value = cfg.colors.danger[500];
      if (s500 && cfg.colors?.success?.[500]) s500.value = cfg.colors.success[500];
      if (w500 && cfg.colors?.warning?.[500]) w500.value = cfg.colors.warning[500];

      const disableManual = mode !== 'manual';
      [p500, p600, n50, n900, d500, s500, w500].forEach((el) => {
        if (el) el.disabled = disableManual;
      });
      if (baseInput) baseInput.disabled = mode === 'manual';
    };

    const onModeChange = () => {
      mode = (modeSelect?.value as PaletteMode) ?? 'manual';
      if (mode !== 'manual') {
        const base = baseInput?.value ?? '#5b8def';
        const palette = generatePalette(base);
        if (palette) applyPalette(palette);
      }
      syncInputs();
    };

    const onBaseChange = () => {
      if (mode === 'manual') return;
      const base = baseInput?.value ?? '#5b8def';
      const palette = generatePalette(base);
      if (palette) applyPalette(palette);
    };

    const onManualInput = () => {
      if (mode !== 'manual') return;
      api.updateConfig((cfg) => ({
        ...cfg,
        colors: {
          ...cfg.colors,
          primary: { 500: p500?.value ?? '', 600: p600?.value ?? '' },
          neutral: { 50: n50?.value ?? '', 900: n900?.value ?? '' },
          danger: { 500: d500?.value ?? '' },
          success: s500?.value ? { 500: s500.value } : cfg.colors?.success,
          warning: w500?.value ? { 500: w500.value } : cfg.colors?.warning,
        },
      }));
    };

    modeSelect?.addEventListener('change', onModeChange);
    baseInput?.addEventListener('input', onBaseChange);
    [p500, p600, n50, n900, d500, s500, w500].forEach((el) =>
      el?.addEventListener('input', onManualInput)
    );

    const unsubscribe = api.subscribe(syncInputs);
    syncInputs();

    return () => {
      modeSelect?.removeEventListener('change', onModeChange);
      baseInput?.removeEventListener('input', onBaseChange);
      [p500, p600, n50, n900, d500, s500, w500].forEach((el) => {
        el?.removeEventListener('input', onManualInput);
      });
      unsubscribe();
    };
  },
};

// Re-export explicitly to avoid tree-shaking glitches in dev reloads.
export { colorsCompilerEntry as default };

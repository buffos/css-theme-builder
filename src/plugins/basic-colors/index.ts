import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

// Augment ThemeModules with colors section.
declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    colors: {
      primary: { 500: string; 600: string };
      neutral: { 50: string; 900: string };
      danger?: { 500: string };
    };
  }
}

// Compiler hooks for this plugin.
export const colorsCompilerEntry = {
  id: 'colors' as const,
  title: 'Colors',
  isEnabled: (config: ThemeConfig) =>
    Boolean(config.colors?.primary?.[500] && config.colors?.neutral?.[50]),
  emitTokens: (config: ThemeConfig) => {
    if (!config.colors) return '';
    const lines = [
      ':root {',
      `  --color-primary-500: ${config.colors.primary?.[500] ?? ''};`,
      `  --color-primary-600: ${config.colors.primary?.[600] ?? ''};`,
      `  --color-neutral-50: ${config.colors.neutral?.[50] ?? ''};`,
      `  --color-neutral-900: ${config.colors.neutral?.[900] ?? ''};`,
    ];
    if (config.colors.danger?.[500]) {
      lines.push(`  --color-danger-500: ${config.colors.danger[500]};`);
    }
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

// Controls with palette modes and manual overrides.
export const colorsControlModule: ControlModule = {
  id: 'colors',
  title: 'Colors',
  mount: (container, api) => {
    let mode: 'manual' | 'analogous' | 'complementary' | 'triadic' = 'manual';

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
      <p class="controls-placeholder">Pick a mode or fine-tune manually.</p>
    `;

    const modeSelect = container.querySelector<HTMLSelectElement>('#color-mode');
    const baseInput = container.querySelector<HTMLInputElement>('#base-color');
    const p500 = container.querySelector<HTMLInputElement>('#primary-500');
    const p600 = container.querySelector<HTMLInputElement>('#primary-600');
    const n50 = container.querySelector<HTMLInputElement>('#neutral-50');
    const n900 = container.querySelector<HTMLInputElement>('#neutral-900');
    const d500 = container.querySelector<HTMLInputElement>('#danger-500');

    // Convert hex (#rrggbb) to HSL components.
    // hex: 7-char string; returns h in [0,360), s/l in [0,1].
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

    // Map hue angle to the pre-offset RGB segment for HSL → RGB conversion.
    // h = hue angle (0–360), c = chroma (distance from gray), x = secondary component within the hue sector.
    const hueSegment = (h: number, c: number, x: number): [number, number, number] => {
      if (h < 60) return [c, x, 0];
      if (h < 120) return [x, c, 0];
      if (h < 180) return [0, c, x];
      if (h < 240) return [0, x, c];
      if (h < 300) return [x, 0, c];
      return [c, 0, x];
    };

    // Convert HSL back to hex; h in degrees, s/l in [0,1].
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

    // Shift hue (delta in degrees) and optionally adjust lightness (lAdjust) and saturation (sAdjust), returning a hex color.
    // hex: base color; delta: hue shift in degrees; lAdjust/sAdjust: additive adjustments in [−1,1].
    const shiftHue = (hex: string, delta: number, lAdjust = 0, sAdjust = 0): string => {
      const { h, s, l } = hexToHsl(hex);
      const h2 = (h + delta + 360) % 360;
      const l2 = Math.max(0, Math.min(1, l + lAdjust));
      const s2 = Math.max(0, Math.min(1, s + sAdjust));
      return hslToHex(h2, s2, l2);
    };

    // Generate palette variants from a base color for the chosen mode.
    const generatePalette = (base: string) => {
      switch (mode) {
        case 'analogous':
          return {
            p500: base,
            p600: shiftHue(base, 20, -0.03),
            n50: shiftHue(base, -30, 0.25, -0.25),
            n900: shiftHue(base, 40, -0.3, -0.2),
            d500: shiftHue(base, -50, 0, 0.1),
          };
        case 'complementary':
          return {
            p500: base,
            p600: shiftHue(base, 180, -0.02),
            n50: shiftHue(base, 0, 0.3, -0.3),
            n900: shiftHue(base, 180, -0.25, -0.2),
            d500: shiftHue(base, 200, 0, 0.05),
          };
        case 'triadic':
          return {
            p500: base,
            p600: shiftHue(base, 120, -0.02),
            n50: shiftHue(base, -120, 0.25, -0.25),
            n900: shiftHue(base, 120, -0.25, -0.2),
            d500: shiftHue(base, -60, 0, 0.05),
          };
        default:
          return null;
      }
    };

    // Apply a generated or manual palette into the shared theme config.
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

      const disableManual = mode !== 'manual';
      [p500, p600, n50, n900, d500].forEach((el) => {
        if (el) el.disabled = disableManual;
      });
      if (baseInput) baseInput.disabled = mode === 'manual';
    };

    const onModeChange = () => {
      mode = (modeSelect?.value as typeof mode) ?? 'manual';
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
        },
      }));
    };

    modeSelect?.addEventListener('change', onModeChange);
    baseInput?.addEventListener('input', onBaseChange);
    [p500, p600, n50, n900, d500].forEach((el) => el?.addEventListener('input', onManualInput));

    const unsubscribe = api.subscribe(syncInputs);
    syncInputs();

    return () => {
      modeSelect?.removeEventListener('change', onModeChange);
      baseInput?.removeEventListener('input', onBaseChange);
      [p500, p600, n50, n900, d500].forEach((el) =>
        el?.removeEventListener('input', onManualInput)
      );
      unsubscribe();
    };
  },
};

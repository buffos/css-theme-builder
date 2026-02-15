import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

import { getGoogleFontImport, GOOGLE_FONTS, isGoogleFont } from './fonts';

// Augment ThemeModules with typography section (explicit shape to avoid cycles).
declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    typography: {
      fontFamily: string;
      baseFontSizePx: number;
      scaleMode: 'manual' | 'modular';
      ratio: number;
      scale: {
        sm: { sizeRem: number; lineHeight: number };
        base: { sizeRem: number; lineHeight: number };
        lg: { sizeRem: number; lineHeight: number };
        xl: { sizeRem: number; lineHeight: number };
        '2xl': { sizeRem: number; lineHeight: number };
        '3xl': { sizeRem: number; lineHeight: number };
      };
    };
  }
}

export const typographyCompilerEntry = {
  id: 'typography' as const,
  title: 'Typography',
  isEnabled: (config: ThemeConfig) => Boolean(config.typography),
  emitTokens: (config: ThemeConfig) => {
    if (!config.typography) return '';
    const fontFamily = config.typography.fontFamily ?? 'Inter, sans-serif';
    const baseFontSizePx = config.typography.baseFontSizePx ?? 16;
    const scale = config.typography.scale;
    const fontImport = isGoogleFont(fontFamily) ? getGoogleFontImport(fontFamily) : '';

    const s = {
      sm:   { size: scale?.sm?.sizeRem   ?? 0.875, line: scale?.sm?.lineHeight   ?? 1.4 },
      base: { size: scale?.base?.sizeRem ?? 1,     line: scale?.base?.lineHeight ?? 1.6 },
      lg:   { size: scale?.lg?.sizeRem   ?? 1.125, line: scale?.lg?.lineHeight   ?? 1.6 },
      xl:   { size: scale?.xl?.sizeRem   ?? 1.25,  line: scale?.xl?.lineHeight   ?? 1.6 },
      '2xl':{ size: scale?.['2xl']?.sizeRem ?? 1.5, line: scale?.['2xl']?.lineHeight ?? 1.6 },
      '3xl':{ size: scale?.['3xl']?.sizeRem ?? 2,   line: scale?.['3xl']?.lineHeight ?? 1.6 },
    };

    return [
      fontImport,
      `  --font-family: ${fontFamily};`,
      `  --base-font-size: ${baseFontSizePx}px;`,
      `  --text-sm-size: ${s.sm.size}rem;`,
      `  --text-sm-line-height: ${s.sm.line};`,
      `  --text-base-size: ${s.base.size}rem;`,
      `  --text-base-line-height: ${s.base.line};`,
      `  --text-lg-size: ${s.lg.size}rem;`,
      `  --text-lg-line-height: ${s.lg.line};`,
      `  --text-xl-size: ${s.xl.size}rem;`,
      `  --text-xl-line-height: ${s.xl.line};`,
      `  --text-2xl-size: ${s['2xl'].size}rem;`,
      `  --text-2xl-line-height: ${s['2xl'].line};`,
      `  --text-3xl-size: ${s['3xl'].size}rem;`,
      `  --text-3xl-line-height: ${s['3xl'].line};`,
    ].join('\n');
  },
  emitUtilities: () =>
    [
      `.text-sm { font-size: var(--text-sm-size); line-height: var(--text-sm-line-height); }`,
      `.text-base { font-size: var(--text-base-size); line-height: var(--text-base-line-height); }`,
      `.text-lg { font-size: var(--text-lg-size); line-height: var(--text-lg-line-height); }`,
      `.text-xl { font-size: var(--text-xl-size); line-height: var(--text-xl-line-height); }`,
      `.text-2xl { font-size: var(--text-2xl-size); line-height: var(--text-2xl-line-height); }`,
      `.text-3xl { font-size: var(--text-3xl-size); line-height: var(--text-3xl-line-height); }`,
    ].join('\n'),
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const calculateRem = (
  mode: 'manual' | 'modular',
  input: HTMLInputElement | null,
  def: number,
  base: number,
  ratio: number,
  step: number
) => {
  if (mode === 'modular') return Math.round(base * Math.pow(ratio, step) * 1000) / 1000;
  return clamp(Number(input?.value ?? def), 0.6, 6);
};

type TypographyInputs = {
  fontFamily: HTMLInputElement | null;
  baseSize: HTMLInputElement | null;
  scaleMode: HTMLSelectElement | null;
  scaleRatio: HTMLSelectElement | null;
  ratioGroup: HTMLElement | null;
  smSize: HTMLInputElement | null;
  smLine: HTMLInputElement | null;
  baseSizeRem: HTMLInputElement | null;
  baseLine: HTMLInputElement | null;
  lgSize: HTMLInputElement | null;
  lgLine: HTMLInputElement | null;
  xlSize: HTMLInputElement | null;
  xlLine: HTMLInputElement | null;
  '2xlSize': HTMLInputElement | null;
  '2xlLine': HTMLInputElement | null;
  '3xlSize': HTMLInputElement | null;
  '3xlLine': HTMLInputElement | null;
};

const calculateScale = (
  mode: 'manual' | 'modular',
  inputs: TypographyInputs,
  current: NonNullable<ThemeConfig['typography']>,
  baseRem: number,
  ratio: number
) => ({
  sm: {
    sizeRem: calculateRem(mode, inputs.smSize, current.scale?.sm?.sizeRem ?? 0.875, baseRem, ratio, -1),
    lineHeight: clamp(Number(inputs.smLine?.value ?? 1.4), 1, 2.2),
  },
  base: {
    sizeRem: baseRem,
    lineHeight: clamp(Number(inputs.baseLine?.value ?? 1.6), 1, 2.4),
  },
  lg: {
    sizeRem: calculateRem(mode, inputs.lgSize, current.scale?.lg?.sizeRem ?? 1.125, baseRem, ratio, 1),
    lineHeight: clamp(Number(inputs.lgLine?.value ?? 1.6), 1, 2.8),
  },
  xl: {
    sizeRem: calculateRem(mode, inputs.xlSize, current.scale?.xl?.sizeRem ?? 1.25, baseRem, ratio, 2),
    lineHeight: clamp(Number(inputs.xlLine?.value ?? 1.6), 1, 3.2),
  },
  '2xl': {
    sizeRem: calculateRem(mode, inputs['2xlSize'], current.scale?.['2xl']?.sizeRem ?? 1.5, baseRem, ratio, 3),
    lineHeight: clamp(Number(inputs['2xlLine']?.value ?? 1.6), 1, 3.2),
  },
  '3xl': {
    sizeRem: calculateRem(mode, inputs['3xlSize'], current.scale?.['3xl']?.sizeRem ?? 2, baseRem, ratio, 4),
    lineHeight: clamp(Number(inputs['3xlLine']?.value ?? 1.6), 1, 3.2),
  },
});

const setSafeVal = (input: HTMLInputElement | HTMLSelectElement | null, value: string | number | undefined) => {
  if (!input || document.activeElement === input) return;
  const valStr = String(value ?? '');
  if (input.value !== valStr) {
    input.value = valStr;
  }
};

const syncScaleField = (input: HTMLInputElement | null, value: number | undefined, fallback: number) => {
  setSafeVal(input, value ?? fallback);
};

const syncFieldValues = (inputs: TypographyInputs, typography: NonNullable<ThemeConfig['typography']>) => {
  const scale = typography.scale;
  setSafeVal(inputs.fontFamily, typography.fontFamily ?? 'Inter, sans-serif');
  setSafeVal(inputs.baseSize, String(typography.baseFontSizePx ?? 16));
  setSafeVal(inputs.scaleMode, typography.scaleMode);
  setSafeVal(inputs.scaleRatio, String(typography.ratio));

  syncScaleField(inputs.smSize,     scale?.sm?.sizeRem,       0.875);
  syncScaleField(inputs.smLine,     scale?.sm?.lineHeight,    1.4);
  syncScaleField(inputs.baseSizeRem,scale?.base?.sizeRem,     1);
  syncScaleField(inputs.baseLine,   scale?.base?.lineHeight,  1.6);
  syncScaleField(inputs.lgSize,     scale?.lg?.sizeRem,       1.125);
  syncScaleField(inputs.lgLine,     scale?.lg?.lineHeight,    1.6);
  syncScaleField(inputs.xlSize,     scale?.xl?.sizeRem,       1.25);
  syncScaleField(inputs.xlLine,     scale?.xl?.lineHeight,    1.6);
  syncScaleField(inputs['2xlSize'], scale?.['2xl']?.sizeRem,  1.5);
  syncScaleField(inputs['2xlLine'], scale?.['2xl']?.lineHeight,1.6);
  syncScaleField(inputs['3xlSize'], scale?.['3xl']?.sizeRem,  2);
  syncScaleField(inputs['3xlLine'], scale?.['3xl']?.lineHeight,1.6);
};

export const typographyControlModule: ControlModule = {
  id: 'typography',
  title: 'Typography',
  mount: (container, api) => {
    container.innerHTML = `
      <div class="control-grid">
        <div class="control-group">
          <label for="font-family">Font family</label>
          <input id="font-family" name="font-family" type="text" list="font-family-list" placeholder='e.g. Inter, Montserrat' />
          <datalist id="font-family-list">
            ${GOOGLE_FONTS.map((f) => `<option value="${f}"></option>`).join('')}
          </datalist>
        </div>
        <div class="control-group">
          <label for="base-size">Base font size (px)</label>
          <input id="base-size" name="base-size" type="number" min="10" max="24" step="1" />
        </div>
      </div>
      <div class="control-grid">
        <div class="control-group">
          <label for="scale-mode">Scale mode</label>
          <select id="scale-mode" name="scale-mode">
            <option value="manual">Manual</option>
            <option value="modular">Modular</option>
          </select>
        </div>
        <div class="control-group" id="ratio-group">
          <label for="scale-ratio">Ratio</label>
          <select id="scale-ratio" name="scale-ratio">
            <option value="1.067">Minor Second (1.067)</option>
            <option value="1.125">Major Second (1.125)</option>
            <option value="1.200">Minor Third (1.200)</option>
            <option value="1.250">Major Third (1.250)</option>
            <option value="1.333">Perfect Fourth (1.333)</option>
            <option value="1.414">Augmented Fourth (1.414)</option>
            <option value="1.500">Perfect Fifth (1.500)</option>
            <option value="1.618">Golden Ratio (1.618)</option>
          </select>
        </div>
      </div>
      <div class="control-grid">
        <div class="control-group">
          <label for="scale-sm-size">sm size (rem)</label>
          <input id="scale-sm-size" name="scale-sm-size" type="number" min="0.6" max="2" step="0.001" />
        </div>
        <div class="control-group">
          <label for="scale-sm-line">sm line-height</label>
          <input id="scale-sm-line" name="scale-sm-line" type="number" min="1" max="2.2" step="0.05" />
        </div>
        <div class="control-group">
          <label for="scale-base-size">base size (rem)</label>
          <input id="scale-base-size" name="scale-base-size" type="number" min="0.8" max="2.4" step="0.001" />
        </div>
        <div class="control-group">
          <label for="scale-base-line">base line-height</label>
          <input id="scale-base-line" name="scale-base-line" type="number" min="1" max="2.4" step="0.05" />
        </div>
        <div class="control-group">
          <label for="scale-lg-size">lg size (rem)</label>
          <input id="scale-lg-size" name="scale-lg-size" type="number" min="0.9" max="3" step="0.001" />
        </div>
        <div class="control-group">
          <label for="scale-lg-line">lg line-height</label>
          <input id="scale-lg-line" name="scale-lg-line" type="number" min="1" max="2.8" step="0.05" />
        </div>
        <div class="control-group">
          <label for="scale-xl-size">xl size (rem)</label>
          <input id="scale-xl-size" name="scale-xl-size" type="number" min="1" max="4" step="0.001" />
        </div>
        <div class="control-group">
          <label for="scale-xl-line">xl line-height</label>
          <input id="scale-xl-line" name="scale-xl-line" type="number" min="1" max="3.2" step="0.05" />
        </div>
        <div class="control-group">
          <label for="scale-2xl-size">2xl size (rem)</label>
          <input id="scale-2xl-size" name="scale-2xl-size" type="number" min="1.2" max="5" step="0.001" />
        </div>
        <div class="control-group">
          <label for="scale-2xl-line">2xl line-height</label>
          <input id="scale-2xl-line" name="scale-2xl-line" type="number" min="1" max="3.2" step="0.05" />
        </div>
        <div class="control-group">
          <label for="scale-3xl-size">3xl size (rem)</label>
          <input id="scale-3xl-size" name="scale-3xl-size" type="number" min="1.5" max="6" step="0.001" />
        </div>
        <div class="control-group">
          <label for="scale-3xl-line">3xl line-height</label>
          <input id="scale-3xl-line" name="scale-3xl-line" type="number" min="1" max="3.2" step="0.05" />
        </div>
      </div>
      <p class="controls-placeholder">
        Adjust font family, base size, and typographic scale.
      </p>
    `;

    const byId = <T extends HTMLElement>(id: string) =>
      container.querySelector<T>(`#${id}`);

    const inputs = {
      fontFamily: byId<HTMLInputElement>('font-family'),
      baseSize: byId<HTMLInputElement>('base-size'),
      scaleMode: byId<HTMLSelectElement>('scale-mode'),
      scaleRatio: byId<HTMLSelectElement>('scale-ratio'),
      ratioGroup: byId<HTMLElement>('ratio-group'),
      smSize: byId<HTMLInputElement>('scale-sm-size'),
      smLine: byId<HTMLInputElement>('scale-sm-line'),
      baseSizeRem: byId<HTMLInputElement>('scale-base-size'),
      baseLine: byId<HTMLInputElement>('scale-base-line'),
      lgSize: byId<HTMLInputElement>('scale-lg-size'),
      lgLine: byId<HTMLInputElement>('scale-lg-line'),
      xlSize: byId<HTMLInputElement>('scale-xl-size'),
      xlLine: byId<HTMLInputElement>('scale-xl-line'),
      '2xlSize': byId<HTMLInputElement>('scale-2xl-size'),
      '2xlLine': byId<HTMLInputElement>('scale-2xl-line'),
      '3xlSize': byId<HTMLInputElement>('scale-3xl-size'),
      '3xlLine': byId<HTMLInputElement>('scale-3xl-line'),
    };

    const sync = () => {
      const cfg = api.getConfig();
      if (!cfg.typography) return;
      const { scaleMode } = cfg.typography;

      syncFieldValues(inputs, cfg.typography);

      if (inputs.ratioGroup) {
        inputs.ratioGroup.style.display = scaleMode === 'modular' ? 'block' : 'none';
      }

      const isModular = scaleMode === 'modular';
      [inputs.smSize, inputs.baseSizeRem, inputs.lgSize, inputs.xlSize, inputs['2xlSize'], inputs['3xlSize']].forEach((i) => {
        if (i) i.disabled = isModular;
      });
    };

    const onChange = () => {
      const current = api.getConfig().typography;
      if (!current) return;

      const mode = (inputs.scaleMode?.value as 'manual' | 'modular') ?? 'manual';
      const r = Number(inputs.scaleRatio?.value ?? 1.25);
      const baseRem = clamp(Number(inputs.baseSizeRem?.value ?? 1), 0.8, 2.4);

      const scale = calculateScale(mode, inputs, current, baseRem, r);

      api.updateConfig((cfg) => ({
        ...cfg,
        typography: {
          ...current,
          fontFamily: inputs.fontFamily?.value ?? current.fontFamily,
          baseFontSizePx: clamp(Number(inputs.baseSize?.value ?? 16), 10, 24),
          scaleMode: mode,
          ratio: r,
          scale,
        },
      }));
    };

    Object.entries(inputs).forEach(([key, input]) => {
      if (!input) return;
      const eventType = key === 'fontFamily' ? 'change' : 'input';
      input.addEventListener(eventType, onChange);
    });

    inputs.fontFamily?.addEventListener('change', () => {
      // Blur after selection so the next click re-triggers 'focus' logic
      inputs.fontFamily?.blur();
    });

    // Special UX for font-family datalist: clear on focus to show all options, restore on blur if empty.
    let prevFont = '';
    inputs.fontFamily?.addEventListener('focus', () => {
      prevFont = inputs.fontFamily?.value ?? '';
      if (inputs.fontFamily) inputs.fontFamily.value = '';
    });
    inputs.fontFamily?.addEventListener('blur', () => {
      if (inputs.fontFamily && !inputs.fontFamily.value) {
        inputs.fontFamily.value = prevFont;
      }
    });

    const unsubscribe = api.subscribe(sync);
    sync();

    return () => {
      Object.entries(inputs).forEach(([key, input]) => {
        if (!input) return;
        const eventType = key === 'fontFamily' ? 'change' : 'input';
        input.removeEventListener(eventType, onChange);
      });
      unsubscribe();
    };
  },
};

export const typographyPreviewModule = {
  id: 'typography',
  title: 'Typography Scale',
  render: (_config: ThemeConfig) => `
    <div style="display: flex; flex-direction: column; gap: 2rem; color: var(--surface-fg);">
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <span style="font-size: 10px; opacity: 0.5; text-transform: uppercase;">3XL Text (Hero)</span>
        <div style="font-size: var(--text-3xl-size); line-height: var(--text-3xl-line-height);">
          The quick brown fox jumps over the lazy dog.
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <span style="font-size: 10px; opacity: 0.5; text-transform: uppercase;">2XL Text (Title)</span>
        <div style="font-size: var(--text-2xl-size); line-height: var(--text-2xl-line-height);">
          The quick brown fox jumps over the lazy dog.
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <span style="font-size: 10px; opacity: 0.5; text-transform: uppercase;">XL Text (Heading)</span>
        <div style="font-size: var(--text-xl-size); line-height: var(--text-xl-line-height);">
          The quick brown fox jumps over the lazy dog.
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <span style="font-size: 10px; opacity: 0.5; text-transform: uppercase;">Large Text</span>
        <div style="font-size: var(--text-lg-size); line-height: var(--text-lg-line-height);">
          The quick brown fox jumps over the lazy dog.
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <span style="font-size: 10px; opacity: 0.5; text-transform: uppercase;">Base Text</span>
        <div style="font-size: var(--text-base-size); line-height: var(--text-base-line-height);">
          The quick brown fox jumps over the lazy dog. This is your standard body copy size.
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <span style="font-size: 10px; opacity: 0.5; text-transform: uppercase;">Small Text</span>
        <div style="font-size: var(--text-sm-size); line-height: var(--text-sm-line-height);">
          The quick brown fox jumps over the lazy dog. Used for captions and fine print.
        </div>
      </div>
    </div>
  `,
};

export const typographyDefaults = {
  typography: {
    fontFamily: 'Inter, "Segoe UI", system-ui, -apple-system, sans-serif',
    baseFontSizePx: 16,
    scaleMode: 'manual' as const,
    ratio: 1.25,
    scale: {
      sm: { sizeRem: 0.875, lineHeight: 1.4 },
      base: { sizeRem: 1, lineHeight: 1.6 },
      lg: { sizeRem: 1.125, lineHeight: 1.6 },
      xl: { sizeRem: 1.25, lineHeight: 1.6 },
      '2xl': { sizeRem: 1.5, lineHeight: 1.6 },
      '3xl': { sizeRem: 2, lineHeight: 1.6 },
    },
  },
};

import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

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
    const { fontFamily, baseFontSizePx, scale } = config.typography;
    return [
      ':root {',
      `  --font-family: ${fontFamily};`,
      `  --base-font-size: ${baseFontSizePx}px;`,
      `  --text-sm-size: ${scale.sm.sizeRem}rem;`,
      `  --text-sm-line: ${scale.sm.lineHeight};`,
      `  --text-base-size: ${scale.base.sizeRem}rem;`,
      `  --text-base-line: ${scale.base.lineHeight};`,
      `  --text-lg-size: ${scale.lg.sizeRem}rem;`,
      `  --text-lg-line: ${scale.lg.lineHeight};`,
      `  --text-xl-size: ${scale.xl.sizeRem}rem;`,
      `  --text-xl-line: ${scale.xl.lineHeight};`,
      '}',
    ].join('\n');
  },
  emitUtilities: () =>
    [
      `.text-sm { font-size: var(--text-sm-size); line-height: var(--text-sm-line); }`,
      `.text-base { font-size: var(--text-base-size); line-height: var(--text-base-line); }`,
      `.text-lg { font-size: var(--text-lg-size); line-height: var(--text-lg-line); }`,
      `.text-xl { font-size: var(--text-xl-size); line-height: var(--text-xl-line); }`,
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
  return clamp(Number(input?.value ?? def), 0.6, 4);
};

export const typographyControlModule: ControlModule = {
  id: 'typography',
  title: 'Typography',
  mount: (container, api) => {
    container.innerHTML = `
      <div class="control-grid">
        <div class="control-group">
          <label for="font-family">Font family</label>
          <input id="font-family" name="font-family" type="text" placeholder='Inter, "Segoe UI", system-ui' />
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
    };

    const sync = () => {
      const cfg = api.getConfig();
      if (!cfg.typography) return;
      const { fontFamily, baseFontSizePx, scale, scaleMode, ratio } = cfg.typography;
      if (inputs.fontFamily) inputs.fontFamily.value = fontFamily;
      if (inputs.baseSize) inputs.baseSize.value = String(baseFontSizePx);
      if (inputs.scaleMode) inputs.scaleMode.value = scaleMode;
      if (inputs.scaleRatio) inputs.scaleRatio.value = String(ratio);

      if (inputs.ratioGroup) {
        inputs.ratioGroup.style.display = scaleMode === 'modular' ? 'block' : 'none';
      }

      const isModular = scaleMode === 'modular';
      [inputs.smSize, inputs.baseSizeRem, inputs.lgSize, inputs.xlSize].forEach((i) => {
        if (i) i.disabled = isModular;
      });

      if (inputs.smSize) inputs.smSize.value = String(scale.sm.sizeRem);
      if (inputs.smLine) inputs.smLine.value = String(scale.sm.lineHeight);
      if (inputs.baseSizeRem) inputs.baseSizeRem.value = String(scale.base.sizeRem);
      if (inputs.baseLine) inputs.baseLine.value = String(scale.base.lineHeight);
      if (inputs.lgSize) inputs.lgSize.value = String(scale.lg.sizeRem);
      if (inputs.lgLine) inputs.lgLine.value = String(scale.lg.lineHeight);
      if (inputs.xlSize) inputs.xlSize.value = String(scale.xl.sizeRem);
      if (inputs.xlLine) inputs.xlLine.value = String(scale.xl.lineHeight);
    };

    const onChange = () => {
      const current = api.getConfig().typography;
      if (!current) return;

      const mode = (inputs.scaleMode?.value as 'manual' | 'modular') ?? 'manual';
      const r = Number(inputs.scaleRatio?.value ?? 1.25);
      const baseRem = clamp(Number(inputs.baseSizeRem?.value ?? 1), 0.8, 2.4);

      const scale = {
        sm: {
          sizeRem: calculateRem(mode, inputs.smSize, current.scale.sm.sizeRem, baseRem, r, -1),
          lineHeight: clamp(Number(inputs.smLine?.value ?? 1.4), 1, 2.2),
        },
        base: {
          sizeRem: baseRem,
          lineHeight: clamp(Number(inputs.baseLine?.value ?? 1.6), 1, 2.4),
        },
        lg: {
          sizeRem: calculateRem(mode, inputs.lgSize, current.scale.lg.sizeRem, baseRem, r, 1),
          lineHeight: clamp(Number(inputs.lgLine?.value ?? 1.6), 1, 2.8),
        },
        xl: {
          sizeRem: calculateRem(mode, inputs.xlSize, current.scale.xl.sizeRem, baseRem, r, 2),
          lineHeight: clamp(Number(inputs.xlLine?.value ?? 1.6), 1, 3.2),
        },
      };

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

    Object.values(inputs).forEach((input) => input?.addEventListener('input', onChange));

    const unsubscribe = api.subscribe(sync);
    sync();

    return () => {
      Object.values(inputs).forEach((input) => input?.removeEventListener('input', onChange));
      unsubscribe();
    };
  },
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
    },
  },
};

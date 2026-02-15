import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

// Augment ThemeModules with typography section (explicit shape to avoid cycles).
declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
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

export const typographyControlModule: ControlModule = {
  id: 'typography',
  title: 'Typography',
  mount: (container, api) => {
    container.innerHTML = `
      <div class="control-group">
        <label for="font-family">Font family</label>
        <input id="font-family" name="font-family" type="text" placeholder='Inter, "Segoe UI", system-ui' />
      </div>
      <div class="control-grid">
        <div class="control-group">
          <label for="base-size">Base font size (px)</label>
          <input id="base-size" name="base-size" type="number" min="10" max="24" step="1" />
        </div>
        <div class="control-group">
          <label for="scale-sm-size">sm size (rem)</label>
          <input id="scale-sm-size" name="scale-sm-size" type="number" min="0.6" max="2" step="0.01" />
        </div>
        <div class="control-group">
          <label for="scale-sm-line">sm line-height</label>
          <input id="scale-sm-line" name="scale-sm-line" type="number" min="1" max="2.2" step="0.05" />
        </div>
        <div class="control-group">
          <label for="scale-base-size">base size (rem)</label>
          <input id="scale-base-size" name="scale-base-size" type="number" min="0.8" max="2.4" step="0.01" />
        </div>
        <div class="control-group">
          <label for="scale-base-line">base line-height</label>
          <input id="scale-base-line" name="scale-base-line" type="number" min="1" max="2.4" step="0.05" />
        </div>
        <div class="control-group">
          <label for="scale-lg-size">lg size (rem)</label>
          <input id="scale-lg-size" name="scale-lg-size" type="number" min="0.9" max="3" step="0.01" />
        </div>
        <div class="control-group">
          <label for="scale-lg-line">lg line-height</label>
          <input id="scale-lg-line" name="scale-lg-line" type="number" min="1" max="2.8" step="0.05" />
        </div>
        <div class="control-group">
          <label for="scale-xl-size">xl size (rem)</label>
          <input id="scale-xl-size" name="scale-xl-size" type="number" min="1" max="4" step="0.01" />
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
      smSize: byId<HTMLInputElement>('scale-sm-size'),
      smLine: byId<HTMLInputElement>('scale-sm-line'),
      baseSizeRem: byId<HTMLInputElement>('scale-base-size'),
      baseLine: byId<HTMLInputElement>('scale-base-line'),
      lgSize: byId<HTMLInputElement>('scale-lg-size'),
      lgLine: byId<HTMLInputElement>('scale-lg-line'),
      xlSize: byId<HTMLInputElement>('scale-xl-size'),
      xlLine: byId<HTMLInputElement>('scale-xl-line'),
    };

    const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

    const sync = () => {
      const cfg = api.getConfig();
      if (!cfg.typography) return;
      const { fontFamily, baseFontSizePx, scale } = cfg.typography;
      if (inputs.fontFamily) inputs.fontFamily.value = fontFamily;
      if (inputs.baseSize) inputs.baseSize.value = String(baseFontSizePx);
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
      const next = {
        ...current,
        fontFamily: inputs.fontFamily?.value ?? current.fontFamily,
        baseFontSizePx: clamp(Number(inputs.baseSize?.value ?? current.baseFontSizePx), 10, 24),
        scale: {
          sm: {
            sizeRem: clamp(Number(inputs.smSize?.value ?? current.scale.sm.sizeRem), 0.6, 2),
            lineHeight: clamp(Number(inputs.smLine?.value ?? current.scale.sm.lineHeight), 1, 2.2),
          },
          base: {
            sizeRem: clamp(Number(inputs.baseSizeRem?.value ?? current.scale.base.sizeRem), 0.8, 2.4),
            lineHeight: clamp(Number(inputs.baseLine?.value ?? current.scale.base.lineHeight), 1, 2.4),
          },
          lg: {
            sizeRem: clamp(Number(inputs.lgSize?.value ?? current.scale.lg.sizeRem), 0.9, 3),
            lineHeight: clamp(Number(inputs.lgLine?.value ?? current.scale.lg.lineHeight), 1, 2.8),
          },
          xl: {
            sizeRem: clamp(Number(inputs.xlSize?.value ?? current.scale.xl.sizeRem), 1, 4),
            lineHeight: clamp(Number(inputs.xlLine?.value ?? current.scale.xl.lineHeight), 1, 3.2),
          },
        },
      };

      api.updateConfig((cfg) => ({
        ...cfg,
        typography: next,
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
    scale: {
      sm: { sizeRem: 0.875, lineHeight: 1.4 },
      base: { sizeRem: 1, lineHeight: 1.6 },
      lg: { sizeRem: 1.125, lineHeight: 1.6 },
      xl: { sizeRem: 1.25, lineHeight: 1.6 },
    },
  },
};

import type { ControlModule } from '../../app/registry';
import type { ThemeConfig, Tuning } from '../../compiler/types';
import { 
  getContrastRatio, 
  getOnColor, 
  getWCAGLevel, 
  hexToHsl, 
  hslToHex, 
  nudgeContrast 
} from '../../utils/colors';

type PaletteMode = 'manual' | 'analogous' | 'complementary' | 'triadic';

/** Picks which neutral provides better contrast as text on the given background */
const pickOnColor = (bg: string, n50?: string, n900?: string): string => {
  const r50 = n50 ? getContrastRatio(bg, n50) : 0;
  const r900 = n900 ? getContrastRatio(bg, n900) : 0;
  return r900 >= r50 ? (n900 ?? getOnColor(bg)) : (n50 ?? getOnColor(bg));
};


declare module '../../compiler/types' {
  type Tuning = {
    tintStrength: number;
    darkDepth: number;
    lightDepth: number;
    hueOffset: number;
  };
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    colors: {
      primary: { 500: string; 600: string };
      neutral: { 50: string; 900: string };
      tuning?: Tuning;
      danger?: { 500: string };
      success?: { 500: string };
      warning?: { 500: string };
      paletteMode?: 'manual' | 'analogous' | 'complementary' | 'triadic';
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

    const primary500 = getColor(colors.primary?.[500]);
    const primary600 = getColor(colors.primary?.[600]);
    const neutral50 = getColor(colors.neutral?.[50]);
    const neutral900 = getColor(colors.neutral?.[900]);
    const danger500 = getColor(colors.danger?.[500]);
    const success500 = getColor(colors.success?.[500]);
    const warning500 = getColor(colors.warning?.[500]);

    const primaryOn = pickOnColor(primary500 ?? '#5b8def', neutral50, neutral900);
    const dangerOn = pickOnColor(danger500 ?? '#f05656', neutral50, neutral900);
    const successOn = pickOnColor(success500 ?? '#3ba55a', neutral50, neutral900);
    const warningOn = pickOnColor(warning500 ?? '#f29e38', neutral50, neutral900);

    return `
  --color-primary-500: ${primary500 ?? ''};
  --color-primary-600: ${primary600 ?? ''};
  --color-neutral-50: ${neutral50 ?? ''};
  --color-neutral-900: ${neutral900 ?? ''};
  
  --on-primary: ${primaryOn};
  --on-danger: ${dangerOn};
  --on-success: ${successOn};
  --on-warning: ${warningOn};
  
  --color-danger-500: ${danger500 ?? ''};
  --color-success-500: ${success500 ?? ''};
  --color-warning-500: ${warning500 ?? ''};
`;
  },
  emitDarkTokens: (config: ThemeConfig) => {
    const colors = config.colors;
    if (!colors) return '';
    const getColor = (val: unknown) => (typeof val === 'string' ? val : undefined);

    const primary500 = getColor(colors.primary?.[500]);
    const primary600 = getColor(colors.primary?.[600]);
    const neutral50 = getColor(colors.neutral?.[50]);
    const neutral900 = getColor(colors.neutral?.[900]);
    const danger500 = getColor(colors.danger?.[500]);
    const success500 = getColor(colors.success?.[500]);
    const warning500 = getColor(colors.warning?.[500]);

    const primaryOn = pickOnColor(primary500 ?? '#5b8def', neutral50, neutral900);
    const dangerOn = pickOnColor(danger500 ?? '#f05656', neutral50, neutral900);
    const successOn = pickOnColor(success500 ?? '#3ba55a', neutral50, neutral900);
    const warningOn = pickOnColor(warning500 ?? '#f29e38', neutral50, neutral900);

    return `
  --color-primary-500: ${primary500 ?? ''};
  --color-primary-600: ${primary600 ?? ''};
  --color-neutral-50: ${neutral50 ?? ''};
  --color-neutral-900: ${neutral900 ?? ''};
  
  --on-primary: ${primaryOn};
  --on-danger: ${dangerOn};
  --on-success: ${successOn};
  --on-warning: ${warningOn};
  
  --color-danger-500: ${danger500 ?? ''};
  --color-success-500: ${success500 ?? ''};
  --color-warning-500: ${warning500 ?? ''};
`;
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
    tuning: {
      tintStrength: 60,
      darkDepth: 25,
      lightDepth: 92,
      hueOffset: 0,
    },
    danger: { 500: '#f05656' },
    success: { 500: '#3ba55a' },
    warning: { 500: '#f29e38' },
    paletteMode: 'analogous' as const,
  },
};

export const colorsControlModule: ControlModule = {
  id: 'colors',
  title: 'Colors',
  mount: (container, api) => {
    const initialColors = api.getConfig().colors;
    let mode: PaletteMode = initialColors?.paletteMode ?? (initialColors?.tuning ? 'analogous' : 'manual');

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
      <details id="tuning-section" class="control-group" style="margin-bottom: 16px; display: none;">
        <summary style="cursor: pointer; font-size: 13px; font-weight: 600; margin-bottom: 8px;">Neutral Tuning</summary>
        <div style="display: grid; gap: 12px; padding: 12px; background: rgba(0,0,0,0.2); border-radius: 4px; margin-top: 8px;">
          <div class="control-group" style="margin-bottom: 0;">
            <label for="tuning-tint" style="font-size: 11px;">Tint Strength: <span id="val-tint">60</span>%</label>
            <input id="tuning-tint" type="range" min="0" max="100" value="60" style="height: 24px;" />
          </div>
          <div class="control-group" style="margin-bottom: 0;">
            <label for="tuning-dark" style="font-size: 11px;">Dark Depth: <span id="val-dark">25</span>%</label>
            <input id="tuning-dark" type="range" min="5" max="50" value="25" style="height: 24px;" />
          </div>
          <div class="control-group" style="margin-bottom: 0;">
            <label for="tuning-light" style="font-size: 11px;">Light Depth: <span id="val-light">92</span>%</label>
            <input id="tuning-light" type="range" min="80" max="98" value="92" style="height: 24px;" />
          </div>
          <div class="control-group" style="margin-bottom: 0;">
            <label for="tuning-hue" style="font-size: 11px;">Hue Offset: <span id="val-hue">0</span>°</label>
            <input id="tuning-hue" type="range" min="-180" max="180" value="0" style="height: 24px;" />
          </div>
        </div>
      </details>
      <div class="control-grid">
        <div class="control-group">
          <label for="base-color">Base color <span id="base-color-badge"></span></label>
          <input id="base-color" name="base-color" type="color" value="#5b8def" />
        </div>
        <div class="control-group">
          <label for="primary-500">Primary 500 <span id="primary-500-badge"></span></label>
          <input id="primary-500" name="primary-500" type="color" />
        </div>
        <div class="control-group">
          <label for="primary-600">Primary 600 <span id="primary-600-badge"></span></label>
          <input id="primary-600" name="primary-600" type="color" />
        </div>
        <div class="control-group">
          <label for="neutral-50">Neutral 50 <span id="neutral-50-badge"></span></label>
          <input id="neutral-50" name="neutral-50" type="color" />
        </div>
        <div class="control-group">
          <label for="neutral-900">Neutral 900 <span id="neutral-900-badge"></span></label>
          <input id="neutral-900" name="neutral-900" type="color" />
        </div>
        <div class="control-group">
          <label for="danger-500">Danger 500 <span id="danger-500-badge"></span></label>
          <input id="danger-500" name="danger-500" type="color" />
        </div>
        <div class="control-group">
          <label for="success-500">Success 500 <span id="success-500-badge"></span></label>
          <input id="success-500" name="success-500" type="color" />
        </div>
        <div class="control-group">
          <label for="warning-500">Warning 500 <span id="warning-500-badge"></span></label>
          <input id="warning-500" name="warning-500" type="color" />
        </div>
      </div>
    `;

    const inputs = {
      mode: container.querySelector<HTMLSelectElement>('#color-mode'),
      base: container.querySelector<HTMLInputElement>('#base-color'),
      p500: container.querySelector<HTMLInputElement>('#primary-500'),
      p600: container.querySelector<HTMLInputElement>('#primary-600'),
      n50: container.querySelector<HTMLInputElement>('#neutral-50'),
      n900: container.querySelector<HTMLInputElement>('#neutral-900'),
      d500: container.querySelector<HTMLInputElement>('#danger-500'),
      s500: container.querySelector<HTMLInputElement>('#success-500'),
      w500: container.querySelector<HTMLInputElement>('#warning-500'),
      tint: container.querySelector<HTMLInputElement>('#tuning-tint'),
      dark: container.querySelector<HTMLInputElement>('#tuning-dark'),
      light: container.querySelector<HTMLInputElement>('#tuning-light'),
      hue: container.querySelector<HTMLInputElement>('#tuning-hue'),
      tuningSection: container.querySelector<HTMLElement>('#tuning-section'),
    };
    
    const badges = {
      base: container.querySelector<HTMLElement>('#base-color-badge'),
      p500: container.querySelector<HTMLElement>('#primary-500-badge'),
      p600: container.querySelector<HTMLElement>('#primary-600-badge'),
      n50: container.querySelector<HTMLElement>('#neutral-50-badge'),
      n900: container.querySelector<HTMLElement>('#neutral-900-badge'),
      d500: container.querySelector<HTMLElement>('#danger-500-badge'),
      s500: container.querySelector<HTMLElement>('#success-500-badge'),
      w500: container.querySelector<HTMLElement>('#warning-500-badge'),
      valTint: container.querySelector<HTMLElement>('#val-tint'),
      valDark: container.querySelector<HTMLElement>('#val-dark'),
      valLight: container.querySelector<HTMLElement>('#val-light'),
      valHue: container.querySelector<HTMLElement>('#val-hue'),
    };

    /** Picks which neutral will be used as text on the given background */
    const getTextColorFor = (bg: string): string => {
      const cfg = api.getConfig();
      const n50 = cfg.colors?.neutral?.[50] ?? '#f7f9fc';
      const n900 = cfg.colors?.neutral?.[900] ?? '#0f172a';
      const r50 = getContrastRatio(bg, n50);
      const r900 = getContrastRatio(bg, n900);
      return r900 >= r50 ? n900 : n50;
    };

    const fixContrast = (key: string, color: string, onColor: string) => {
      const fixed = nudgeContrast(color, onColor);
      api.updateConfig((cfg) => {
        const next = { ...cfg };
        if (key === 'primary-500') next.colors = { ...next.colors, primary: { ...next.colors?.primary, 500: fixed } };
        if (key === 'primary-600') next.colors = { ...next.colors, primary: { ...next.colors?.primary, 600: fixed } };
        if (key === 'neutral-50') next.colors = { ...next.colors, neutral: { ...next.colors?.neutral, 50: fixed } };
        if (key === 'neutral-900') next.colors = { ...next.colors, neutral: { ...next.colors?.neutral, 900: fixed } };
        if (key === 'danger-500') next.colors = { ...next.colors, danger: { 500: fixed } };
        if (key === 'success-500') next.colors = { ...next.colors, success: { 500: fixed } };
        if (key === 'warning-500') next.colors = { ...next.colors, warning: { 500: fixed } };
        return next;
      });
    };

    const updateBadge = (el: HTMLElement | null, color: string, key: string) => {
      if (!el || !color) return;
      const onColor = getTextColorFor(color);
      const ratio = getContrastRatio(color, onColor);
      const level = getWCAGLevel(ratio);
      
      el.innerHTML = `
        <span class="accessibility-badge" data-level="${level}">${level} ${ratio.toFixed(1)}:1</span>
        ${level === 'Fail' ? `<button class="btn--fix" style="font-size:10px;padding:1px 6px;border-radius:4px;border:1px solid currentColor;background:transparent;color:inherit;cursor:pointer;vertical-align:middle;line-height:1.4;" data-key="${key}" data-color="${color}" data-on="${onColor}">Fix</button>` : ''}
      `;
      
      const fixBtn = el.querySelector<HTMLButtonElement>('.btn--fix');
      fixBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        fixContrast(key, color, onColor);
      });
    };

    const shiftHue = (hex: string, delta: number, lAdjust = 0, sAdjust = 0): string => {
      const { h, s, l } = hexToHsl(hex);
      const h2 = (h + delta + 360) % 360;
      const l2 = Math.max(0, Math.min(1, l + lAdjust));
      const s2 = Math.max(0, Math.min(1, s + sAdjust));
      return hslToHex(h2, s2, l2);
    };

    /** Ensures neutrals hit proper lightness levels. */
    const clampNeutral = (hex: string, target: 'light' | 'dark', tuning?: Tuning): string => {
      const { h, s, l: initialL } = hexToHsl(hex);
      let l = initialL;

      // Defaults if no tuning is provided
      let lightLimit = 0.92;
      let darkLimit = 0.25;
      let tintLimit = 0.6; // multiplier/max cap
      let hueShift = 0;

      if (tuning) {
        lightLimit = tuning.lightDepth / 100;
        darkLimit = tuning.darkDepth / 100;
        tintLimit = tuning.tintStrength / 100;
        hueShift = tuning.hueOffset;
      }

      if (target === 'light') l = Math.max(l, lightLimit);
      if (target === 'dark') l = Math.min(l, darkLimit);

      // Apply tint more aggressively: multiply current saturation by tuning factor
      const sat = Math.max(0, Math.min(1, s * (tuning ? tuning.tintStrength / 60 : 1)));
      const finalSat = Math.min(sat, tintLimit); 
      
      return hslToHex((h + hueShift + 360) % 360, finalSat, l);
    };

    /** 
     * Generates a thematic status color by pinning hue while inheriting 
     * saturation and lightness from the base color.
     */
    const generateStatusColor = (baseColor: string, targetHue: number): string => {
      const { s, l } = hexToHsl(baseColor);
      // Status colors usually benefit from healthy saturation even if theme is muted
      const finalSat = Math.max(0.65, s); 
      // Keep lightness in a safe functional range (not too dark, not too bright)
      const finalL = Math.max(0.45, Math.min(0.6, l));
      return hslToHex(targetHue, finalSat, finalL);
    };

    const generatePalette = (base: string, tuning?: Tuning) => {
      const danger = generateStatusColor(base, 0);   // Red
      const success = generateStatusColor(base, 140); // Green
      const warning = generateStatusColor(base, 35);  // Orange

      // Historical offsets from the "great" version
      switch (mode) {
        case 'analogous':
          return {
            p500: base,
            p600: shiftHue(base, 20, -0.03),
            n50: clampNeutral(shiftHue(base, -30, 0.25, -0.25), 'light', tuning),
            n900: clampNeutral(shiftHue(base, 40, -0.3, -0.2), 'dark', tuning),
            d500: danger,
            s500: success,
            w500: warning,
          };
        case 'complementary':
          return {
            p500: base,
            p600: shiftHue(base, 180, -0.02),
            n50: clampNeutral(shiftHue(base, 0, 0.3, -0.3), 'light', tuning),
            n900: clampNeutral(shiftHue(base, 180, -0.25, -0.2), 'dark', tuning),
            d500: danger,
            s500: success,
            w500: warning,
          };
        case 'triadic':
          return {
            p500: base,
            p600: shiftHue(base, 120, -0.02),
            n50: clampNeutral(shiftHue(base, -120, 0.25, -0.25), 'light', tuning),
            n900: clampNeutral(shiftHue(base, 120, -0.25, -0.2), 'dark', tuning),
            d500: danger,
            s500: success,
            w500: warning,
          };
        default: return null;
      }
    };

    const sync = () => {
      const cfg = api.getConfig();
      const c = cfg.colors;
      if (!c) return;

      const setVal = (input: HTMLInputElement | null, val?: string) => { 
        if (input && val) input.value = val; 
      };
      
      const syncTuningUI = (tuning: Tuning) => {
        if (inputs.tint) inputs.tint.value = String(tuning.tintStrength);
        if (inputs.dark) inputs.dark.value = String(tuning.darkDepth);
        if (inputs.light) inputs.light.value = String(tuning.lightDepth);
        if (inputs.hue) inputs.hue.value = String(tuning.hueOffset);
        
        if (badges.valTint) badges.valTint.innerText = String(tuning.tintStrength);
        if (badges.valDark) badges.valDark.innerText = String(tuning.darkDepth);
        if (badges.valLight) badges.valLight.innerText = String(tuning.lightDepth);
        if (badges.valHue) badges.valHue.innerText = String(tuning.hueOffset);
      };

      const syncBadges = () => {
        updateBadge(badges.base, c.primary?.[500] ?? '', 'base');
        updateBadge(badges.p500, c.primary?.[500] ?? '', 'primary-500');
        updateBadge(badges.p600, c.primary?.[600] ?? '', 'primary-600');
        updateBadge(badges.n50, c.neutral?.[50] ?? '', 'neutral-50');
        updateBadge(badges.n900, c.neutral?.[900] ?? '', 'neutral-900');
        updateBadge(badges.d500, c.danger?.[500] ?? '', 'danger-500');
        updateBadge(badges.s500, c.success?.[500] ?? '', 'success-500');
        updateBadge(badges.w500, c.warning?.[500] ?? '', 'warning-500');
      };

      if (inputs.mode) inputs.mode.value = mode;
      if (inputs.base && c.primary?.[500]) inputs.base.value = c.primary[500];
      
      setVal(inputs.p500, c.primary?.[500]);
      setVal(inputs.p600, c.primary?.[600]);
      setVal(inputs.n50, c.neutral?.[50]);
      setVal(inputs.n900, c.neutral?.[900]);
      setVal(inputs.d500, c.danger?.[500]);
      setVal(inputs.s500, c.success?.[500]);
      setVal(inputs.w500, c.warning?.[500]);
      
      if (c.tuning) syncTuningUI(c.tuning);
      syncBadges();

      const isManual = mode === 'manual';
      [inputs.p500, inputs.p600, inputs.n50, inputs.n900, inputs.d500, inputs.s500, inputs.w500].forEach(i => {
        if (i) i.disabled = !isManual;
      });
      if (inputs.base) inputs.base.disabled = false;

      if (inputs.tuningSection) {
        inputs.tuningSection.style.display = isManual ? 'none' : 'block';
      }
    };

    const onInputChange = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLSelectElement;
      const tuning = {
        tintStrength: Number(inputs.tint?.value ?? 60),
        darkDepth: Number(inputs.dark?.value ?? 25),
        lightDepth: Number(inputs.light?.value ?? 92),
        hueOffset: Number(inputs.hue?.value ?? 0),
      };

      const baseColor = inputs.base?.value ?? '#5b8def';

      const updatePaletteConfig = () => {
        const palette = generatePalette(baseColor, tuning);
        if (!palette) return;
        api.updateConfig(cfg => ({
          ...cfg,
          colors: {
            ...cfg.colors,
            primary: { 500: palette.p500, 600: palette.p600 },
            neutral: { 50: palette.n50, 900: palette.n900 },
            tuning,
            danger: { 500: palette.d500 },
            success: { 500: palette.s500 },
            warning: { 500: palette.w500 },
            paletteMode: mode,
          }
        }));
      };

      const updateNeutralConfig = () => {
        api.updateConfig(cfg => ({
          ...cfg,
          colors: {
            ...cfg.colors,
            tuning,
            paletteMode: mode,
          }
        }));
      };

      if (target.id === 'color-mode') {
        mode = target.value as PaletteMode;
        if (mode === 'manual') {
          sync();
        } else {
          updatePaletteConfig();
          sync();
        }
      } else if (target.id === 'base-color' || target.id.startsWith('tuning-')) {
        if (mode === 'manual') {
          updateNeutralConfig();
        } else {
          updatePaletteConfig();
        }
        if (target.id.startsWith('tuning-')) sync();
      } else {
        api.updateConfig(cfg => ({
          ...cfg,
          colors: {
            ...cfg.colors,
            primary: { 500: inputs.p500?.value ?? '', 600: inputs.p600?.value ?? '' },
            neutral: { 50: inputs.n50?.value ?? '', 900: inputs.n900?.value ?? '' },
            tuning,
            danger: { 500: inputs.d500?.value ?? '' },
            success: { 500: inputs.s500?.value ?? '' },
            warning: { 500: inputs.w500?.value ?? '' },
            paletteMode: mode,
          }
        }));
      }
    };

    Object.values(inputs).forEach(i => {
      if (!i) return;
      const isCheckbox = i instanceof HTMLInputElement && i.type === 'checkbox';
      const eventName = i.tagName === 'SELECT' || isCheckbox ? 'change' : 'input';
      i.addEventListener(eventName, onInputChange);
    });
    
    const unsubscribe = api.subscribe(sync);
    sync();

    return () => {
      unsubscribe();
      Object.values(inputs).forEach(i => i?.removeEventListener('input', onInputChange));
    };
  },
};

export const colorsPreviewModule = {
  id: 'colors',
  title: 'Color Usage Matrix',
  render: (config: ThemeConfig) => {
    return `
    <style>
      .usage-matrix { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; }
      .usage-swatch { 
        padding: 12px; border-radius: 6px; font-size: 11px; font-weight: 600; text-align: center; 
        display: flex; flex-direction: column; gap: 4px; border: 1px solid rgba(128,128,128,0.1); 
        aspect-ratio: 1; justify-content: center;
      }
      .usage-swatch .swatch-label { font-size: 10px; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
      .swatch-hex { font-family: monospace; font-size: 10px; opacity: 0.8; }
    </style>
    <div class="usage-matrix">
      <div class="usage-swatch" style="background: var(--color-primary-500); color: var(--on-primary);">
        <div class="swatch-label">Primary</div>
        <span>Text Example</span>
      </div>
      <div class="usage-swatch" style="background: var(--color-danger-500); color: var(--on-danger);">
        <div class="swatch-label">Danger</div>
        <span>Destructive</span>
      </div>
      <div class="usage-swatch" style="background: var(--color-success-500); color: var(--on-success);">
        <div class="swatch-label">Success</div>
        <span>Validation</span>
      </div>
      <div class="usage-swatch" style="background: var(--color-warning-500); color: var(--on-warning);">
        <div class="swatch-label">Warning</div>
        <span>Attention</span>
      </div>
      
      <!-- Neutral Palette Visibility -->
      <div class="usage-swatch" style="background: var(--color-neutral-50); color: var(--color-neutral-900);">
         <div class="swatch-label">Neutral 50</div>
         <span class="swatch-hex">${config.colors?.neutral?.[50] ?? ''}</span>
      </div>
      <div class="usage-swatch" style="background: var(--color-neutral-900); color: var(--color-neutral-50);">
         <div class="swatch-label">Neutral 900</div>
         <span class="swatch-hex">${config.colors?.neutral?.[900] ?? ''}</span>
      </div>

      <div class="usage-swatch" style="background: var(--color-neutral-50); color: var(--color-neutral-900); border: 2px solid var(--color-primary-500);">
        <div class="swatch-label">N-50 + Border</div>
        <span>Primary Border</span>
      </div>
      
      <div class="usage-swatch" style="background: var(--color-neutral-900); color: var(--on-background); display: flex; align-items: center; justify-content: center; font-size: 24px;">
        <span style="color: var(--color-primary-500); margin: 0 1px;">●</span>
        <span style="color: var(--color-success-500); margin: 0 1px;">●</span>
        <span style="color: var(--color-warning-500); margin: 0 1px;">●</span>
        <span style="color: var(--color-danger-500); margin: 0 1px;">●</span>
      </div>
    </div>
  `;
  },
};

export default colorsCompilerEntry;

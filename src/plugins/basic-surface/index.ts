import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

// Augment ThemeModules with surface section without referencing ThemeConfig to avoid cycles.
declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    surface: {
      background: string;
      onBackground: string;
      card: string;
      onCard: string;
      darkBackground?: string;
      darkOnBackground?: string;
      darkCard?: string;
      darkOnCard?: string;
    };
  }
}

export const surfaceCompilerEntry = {
  id: 'surface' as const,
  title: 'Surface',
  isEnabled: (config: ThemeConfig) => Boolean(config.surface),
  emitTokens: (config: ThemeConfig) => {
    if (!config.surface) return '';
    const { background, onBackground, card, onCard } = config.surface;
    return [
      `  --surface-bg: ${background ?? 'var(--color-neutral-50)'};`,
      `  --on-background: ${onBackground ?? 'var(--color-neutral-900)'};`,
      `  --surface-card: ${card ?? '#ffffff'};`,
      `  --on-card: ${onCard ?? 'var(--color-neutral-900)'};`,
    ].join('\n');
  },
  emitDarkTokens: (config: ThemeConfig) => {
    if (!config.surface) return '';
    const { darkBackground, darkOnBackground, darkCard, darkOnCard } = config.surface;
    return [
      `  --surface-bg: ${darkBackground ?? 'var(--color-neutral-900)'};`,
      `  --on-background: ${darkOnBackground ?? 'var(--color-neutral-50)'};`,
      `  --surface-card: ${darkCard ?? 'color-mix(in srgb, var(--color-neutral-900) 90%, white)'};`,
      `  --on-card: ${darkOnCard ?? 'var(--color-neutral-50)'};`,
    ].join('\n');
  },
};

export const surfaceControlModule: ControlModule = {
  id: 'surface',
  title: 'Surface',
  mount: (container, api) => {
    container.innerHTML = `
      <div class="control-grid">
        <div class="control-section-header" style="grid-column: 1 / -1; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.6;">Light Mode</div>
        <div class="control-group">
          <label for="surface-bg">Background</label>
          <input id="surface-bg" name="background" type="text" placeholder="Default: Neutral 50" />
        </div>
        <div class="control-group">
          <label for="surface-on-bg">On Background</label>
          <input id="surface-on-bg" name="onBackground" type="text" placeholder="Default: Neutral 900" />
        </div>
        <div class="control-group">
          <label for="surface-card">Card / Layer</label>
          <input id="surface-card" name="card" type="text" placeholder="Default: #ffffff" />
        </div>
        <div class="control-group">
          <label for="surface-on-card">On Card</label>
          <input id="surface-on-card" name="onCard" type="text" placeholder="Default: Neutral 900" />
        </div>

        <div class="control-section-header" style="grid-column: 1 / -1; margin-top: 16px; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.6;">Dark Mode Overrides</div>
        <div class="control-group">
          <label for="dark-surface-bg">Background</label>
          <input id="dark-surface-bg" name="darkBackground" type="text" placeholder="Default: Neutral 900" />
        </div>
        <div class="control-group">
          <label for="dark-surface-on-bg">On Background</label>
          <input id="dark-surface-on-bg" name="darkOnBackground" type="text" placeholder="Default: Neutral 50" />
        </div>
        <div class="control-group">
          <label for="dark-surface-card">Card / Layer</label>
          <input id="dark-surface-card" name="darkCard" type="text" placeholder="Default: Neutral 900 (tinted)" />
        </div>
         <div class="control-group">
          <label for="dark-surface-on-card">On Card</label>
          <input id="dark-surface-on-card" name="darkOnCard" type="text" placeholder="Default: Neutral 50" />
        </div>
      </div>
      <p class="controls-placeholder">
        Define semantic layers and their text colors. Use <code>var(--color-neutral-*)</code> to link to the global palette.
      </p>
    `;

    const inputs = container.querySelectorAll<HTMLInputElement>('input[type="text"]');

    const sync = () => {
      const cfg = api.getConfig();
      if (!cfg.surface) return;

      inputs.forEach((input) => {
        const key = input.name as keyof Required<NonNullable<ThemeConfig['surface']>>;
        const val = cfg.surface?.[key];
        input.value = val ?? '';
      });
    };

    const onChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const key = target.name as keyof Required<NonNullable<ThemeConfig['surface']>>;
      const val = target.value;

      api.updateConfig((cfg) => ({
        ...cfg,
        surface: {
          ...cfg.surface,
          [key]: val,
        },
      }));
    };

    inputs.forEach((input) => input.addEventListener('input', onChange));

    const unsubscribe = api.subscribe(sync);
    sync();

    return () => {
      unsubscribe();
      inputs.forEach((input) => input.removeEventListener('input', onChange));
    };
  },
};

export const surfacePreviewModule = {
  id: 'surface',
  title: 'Surfaces Gallery',
  render: (_config: ThemeConfig) => {
    return `
      <div style="background: var(--surface-bg); color: var(--on-background); padding: 24px; border-radius: 8px; border: 1px solid rgba(128,128,128,0.1); display: flex; flex-direction: column; gap: 16px;">
        <div>
          <h4 style="margin: 0 0 4px 0;">Background Layer</h4>
          <p style="margin: 0; font-size: 13px; opacity: 0.8;">Text on background uses <code>--on-background</code>.</p>
        </div>
        
        <div style="background: var(--surface-card); color: var(--on-card); padding: 16px; border-radius: 12px; border: 1px solid rgba(128,128,128,0.1); box-shadow: var(--shadow-md);">
          <h4 style="margin: 0 0 4px 0;">Card / Container Layer</h4>
          <p style="margin: 0; font-size: 13px; opacity: 0.8;">Text on cards uses <code>--on-card</code>.</p>
          <button class="btn btn--primary" style="margin-top: 12px;">Component on Card</button>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div style="background: var(--surface-card); color: var(--on-card); padding: 12px; border-radius: 8px; border: 1px solid rgba(128,128,128,0.1); text-align: center;">
            <span style="font-weight: 600;">Grid Item 1</span>
          </div>
          <div style="background: var(--surface-card); color: var(--on-card); padding: 12px; border-radius: 8px; border: 1px solid rgba(128,128,128,0.1); text-align: center;">
            <span style="font-weight: 600;">Grid Item 2</span>
          </div>
        </div>
      </div>
    `;
  },
};

export const surfaceDefaults = {
  surface: {
    background: 'var(--color-neutral-50)',
    onBackground: 'var(--color-neutral-900)',
    card: '#ffffff',
    onCard: 'var(--color-neutral-900)',
    // Dark mode overrides remain optional and use snippets
  },
};

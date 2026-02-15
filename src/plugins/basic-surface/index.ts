import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

// Augment ThemeModules with surface section without referencing ThemeConfig to avoid cycles.
declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    surface: {
      background: string;
      foreground: string;
      card: string;
      darkBackgroundSnippet?: string; // Optional custom dark background
      darkForegroundSnippet?: string;
      darkCardSnippet?: string;
    };
  }
}

export const surfaceCompilerEntry = {
  id: 'surface' as const,
  title: 'Surface',
  isEnabled: (config: ThemeConfig) => Boolean(config.surface),
  emitTokens: (config: ThemeConfig) => {
    if (!config.surface) return '';
    return [
      ':root {',
      `  --surface-bg: ${config.surface.background};`,
      `  --surface-fg: ${config.surface.foreground};`,
      `  --surface-card: ${config.surface.card};`,
      '}',
    ].join('\n');
  },
  emitDarkTokens: (config: ThemeConfig) => {
    if (!config.surface) return '';
    const { darkBackgroundSnippet, darkForegroundSnippet, darkCardSnippet } = config.surface;
    return [
      ':root {',
      `  --surface-bg: ${darkBackgroundSnippet ?? '#0b1021'};`,
      `  --surface-fg: ${darkForegroundSnippet ?? '#e7ecff'};`,
      `  --surface-card: ${darkCardSnippet ?? '#0f1729'};`,
      '}',
    ].join('\n');
  },
};

export const surfaceControlModule: ControlModule = {
  id: 'surface',
  title: 'Surface',
  mount: (container, api) => {
    container.innerHTML = `
      <div class="control-grid">
        <div class="control-section-header">Light Mode</div>
        <div class="control-group">
          <label for="surface-bg">Background</label>
          <input id="surface-bg" name="background" type="color" />
        </div>
        <div class="control-group">
          <label for="surface-fg">Foreground (Text)</label>
          <input id="surface-fg" name="foreground" type="color" />
        </div>
        <div class="control-group">
          <label for="surface-card">Card / Layer</label>
          <input id="surface-card" name="card" type="color" />
        </div>

        <div class="control-section-header" style="margin-top: 16px;">Dark Mode</div>
        <div class="control-group">
          <label for="dark-surface-bg">Background</label>
          <input id="dark-surface-bg" name="darkBackgroundSnippet" type="color" />
        </div>
        <div class="control-group">
          <label for="dark-surface-fg">Foreground (Text)</label>
          <input id="dark-surface-fg" name="darkForegroundSnippet" type="color" />
        </div>
        <div class="control-group">
          <label for="dark-surface-card">Card / Layer</label>
          <input id="dark-surface-card" name="darkCardSnippet" type="color" />
        </div>
      </div>
      <p class="controls-placeholder">
        Define the core foundation of your light and dark themes.
      </p>
    `;

    const inputs = container.querySelectorAll<HTMLInputElement>('input[type="color"]');

    const sync = () => {
      const cfg = api.getConfig();
      if (!cfg.surface) return;

      inputs.forEach((input) => {
        const key = input.name as keyof Required<NonNullable<ThemeConfig['surface']>>;
        const val = cfg.surface?.[key];
        if (val) input.value = val;
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
  id: 'surfaces-gallery',
  title: 'Surfaces Gallery',
  render: () => {
    return `
      <div style="background: var(--surface-bg); color: var(--surface-fg); padding: 24px; border-radius: 8px; border: 1px solid var(--color-neutral-900); display: flex; flex-direction: column; gap: 16px;">
        <div>
          <h4 style="margin: 0 0 4px 0;">Background Layer</h4>
          <p style="margin: 0; font-size: 13px; opacity: 0.8;">This is the base surface of your application.</p>
        </div>
        
        <div style="background: var(--surface-card); padding: 16px; border-radius: 12px; border: 1px solid rgba(128,128,128,0.1); box-shadow: var(--shadow-md);">
          <h4 style="margin: 0 0 4px 0;">Card / Container Layer</h4>
          <p style="margin: 0; font-size: 13px; opacity: 0.8;">Cards and containers sit on top of the background.</p>
          <button class="btn btn--primary" style="margin-top: 12px;">Component on Card</button>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div style="background: var(--surface-card); padding: 12px; border-radius: 8px; border: 1px solid rgba(128,128,128,0.1); text-align: center;">
            <span style="font-weight: 600;">Grid Item 1</span>
          </div>
          <div style="background: var(--surface-card); padding: 12px; border-radius: 8px; border: 1px solid rgba(128,128,128,0.1); text-align: center;">
            <span style="font-weight: 600;">Grid Item 2</span>
          </div>
        </div>
      </div>
    `;
  },
};

export const surfaceDefaults = {
  surface: {
    background: '#fafafa',
    foreground: '#0b1021',
    card: '#ffffff',
    darkBackgroundSnippet: '#0b1021',
    darkForegroundSnippet: '#e7ecff',
    darkCardSnippet: '#0f1729',
  },
};

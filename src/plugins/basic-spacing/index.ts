import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    spacing: {
      baseUnitPx: number;
      scaleMode: 'manual' | 'generated';
      tokens: Record<string, string>;
    };
  }
}

const SPACING_STEPS = [0, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64];

export const generateSpacingTokens = (baseUnitPx: number): Record<string, string> => {
  const tokens: Record<string, string> = {};
  SPACING_STEPS.forEach((step) => {
    const value = (step * baseUnitPx) / 16;
    tokens[String(step)] = `${value}rem`;
  });
  return tokens;
};

const spacingUtilities = (tokens: Record<string, string>): string[] =>
  Object.keys(tokens)
    .sort((a, b) => Number(a) - Number(b))
    .flatMap((key) => [
      `.p-${key.replace('.', '_')} { padding: var(--space-${key}); }`,
      `.px-${key.replace('.', '_')} { padding-left: var(--space-${key}); padding-right: var(--space-${key}); }`,
      `.py-${key.replace('.', '_')} { padding-top: var(--space-${key}); padding-bottom: var(--space-${key}); }`,
      `.m-${key.replace('.', '_')} { margin: var(--space-${key}); }`,
      `.gap-${key.replace('.', '_')} { gap: var(--space-${key}); }`,
    ]);

export const spacingCompilerEntry = {
  id: 'spacing' as const,
  title: 'Spacing',
  isEnabled: (config: ThemeConfig) => Boolean(config.spacing),
  emitTokens: (config: ThemeConfig) => {
    if (!config.spacing) return '';
    const { tokens } = config.spacing;
    const lines = Object.keys(tokens)
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => `  --space-${key}: ${tokens[key]};`);
    return [':root {', ...lines, '}'].join('\n');
  },
  emitUtilities: (config: ThemeConfig) =>
    config.spacing ? spacingUtilities(config.spacing.tokens).join('\n') : '',
};

export const spacingControlModule: ControlModule = {
  id: 'spacing',
  title: 'Spacing',
  mount: (container, api) => {
    container.innerHTML = `
      <div class="control-grid">
        <div class="control-group">
          <label for="spacing-base">Base unit (px)</label>
          <input id="spacing-base" name="spacing-base" type="number" min="1" max="16" step="1" />
        </div>
        <div class="control-group">
          <label for="spacing-mode">Scale mode</label>
          <select id="spacing-mode" name="spacing-mode">
            <option value="generated">Generated</option>
            <option value="manual">Manual</option>
          </select>
        </div>
      </div>
      <div id="spacing-tokens-list" class="control-list">
        <!-- Tokens will be listed here -->
      </div>
      <p class="controls-placeholder">
        Spacing is defined in multiples of the base unit.
      </p>
    `;

    const baseInput = container.querySelector<HTMLInputElement>('#spacing-base');
    const modeSelect = container.querySelector<HTMLSelectElement>('#spacing-mode');
    const tokensList = container.querySelector<HTMLElement>('#spacing-tokens-list');

    const sync = () => {
      const cfg = api.getConfig();
      if (!cfg.spacing) return;
      const { baseUnitPx, scaleMode, tokens } = cfg.spacing;

      if (baseInput) baseInput.value = String(baseUnitPx);
      if (modeSelect) modeSelect.value = scaleMode;

      if (tokensList) {
        tokensList.innerHTML = '';
        Object.keys(tokens)
          .sort((a, b) => Number(a) - Number(b))
          .forEach((key) => {
            const row = document.createElement('div');
            row.className = 'control-row';
            row.innerHTML = `
              <span>${key}</span>
              <input type="text" value="${tokens[key]}" ${scaleMode === 'generated' ? 'disabled' : ''} data-key="${key}" />
            `;
            tokensList.appendChild(row);
          });
      }
    };

    const onChange = () => {
      const current = api.getConfig().spacing;
      if (!current) return;

      const baseUnitPx = Math.max(1, Number(baseInput?.value ?? 4));
      const scaleMode = (modeSelect?.value as 'manual' | 'generated') ?? 'generated';

      let tokens = { ...current.tokens };
      if (scaleMode === 'generated') {
        tokens = generateSpacingTokens(baseUnitPx);
      } else {
        // Collect manual overrides from inputs
        tokensList?.querySelectorAll('input').forEach((input) => {
          const key = input.dataset.key;
          if (key) tokens[key] = input.value;
        });
      }

      api.updateConfig((cfg) => ({
        ...cfg,
        spacing: { baseUnitPx, scaleMode, tokens },
      }));
    };

    baseInput?.addEventListener('input', onChange);
    modeSelect?.addEventListener('change', onChange);
    tokensList?.addEventListener('input', (e) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') onChange();
    });

    const unsubscribe = api.subscribe(sync);
    sync();

    return () => {
      baseInput?.removeEventListener('input', onChange);
      modeSelect?.removeEventListener('change', onChange);
      unsubscribe();
    };
  },
};

export const spacingDefaults = {
  spacing: {
    baseUnitPx: 4,
    scaleMode: 'generated' as const,
    tokens: generateSpacingTokens(4),
  },
};

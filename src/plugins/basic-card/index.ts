import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    card: {
      overrides?: {
        bg?: string;
        radius?: string;
        padding?: string;
        border?: string;
        shadow?: string;
      };
    };
  }
}

export const cardCompilerEntry = {
  id: 'card' as const,
  title: 'Card',
  isEnabled: (_config: ThemeConfig) => true,
  emitComponents: (config: ThemeConfig) => {
    const overrides = config.card?.overrides;
    const vars = [
      `--card-bg: ${overrides?.bg ?? 'var(--surface-card, #0f1729)'};`,
      `--card-radius: ${overrides?.radius ?? 'var(--radius-2, 12px)'};`,
      `--card-padding: ${overrides?.padding ?? 'var(--space-4, 1rem)'};`,
      `--card-border: ${overrides?.border ?? '1px solid var(--color-neutral-900, #0f172a)'};`,
      `--card-shadow: ${overrides?.shadow ?? 'var(--shadow-1, 0 1px 3px rgba(0,0,0,0.15))'};`,
    ].join('\n  ');

    return `
.card {
  ${vars}
  padding: var(--card-padding);
  border-radius: var(--card-radius);
  background: var(--card-bg);
  border: var(--card-border);
  box-shadow: var(--card-shadow);
}
`;
  },
};

export const cardControlModule: ControlModule = {
  id: 'card',
  title: 'Card',
  mount: (container, api) => {
    container.innerHTML = `
      <div class="control-divider">Overrides</div>
      <div class="control-grid">
        <div class="control-group">
          <label for="card-ov-bg">Background</label>
          <input id="card-ov-bg" type="text" placeholder="e.g. #fff" />
        </div>
        <div class="control-group">
          <label for="card-ov-radius">Radius</label>
          <input id="card-ov-radius" type="text" placeholder="e.g. 8px" />
        </div>
      </div>
      <div class="control-grid">
        <div class="control-group">
          <label for="card-ov-padding">Padding</label>
          <input id="card-ov-padding" type="text" placeholder="e.g. 2rem" />
        </div>
        <div class="control-group">
          <label for="card-ov-border">Border</label>
          <input id="card-ov-border" type="text" placeholder="e.g. none" />
        </div>
      </div>
      <div class="control-group">
        <label for="card-ov-shadow">Shadow</label>
        <input id="card-ov-shadow" type="text" placeholder="e.g. none" />
      </div>
      <p class="controls-placeholder">
        Override card properties to diverge from theme defaults.
      </p>
    `;

    const inputs = {
      bg: container.querySelector<HTMLInputElement>('#card-ov-bg'),
      radius: container.querySelector<HTMLInputElement>('#card-ov-radius'),
      padding: container.querySelector<HTMLInputElement>('#card-ov-padding'),
      border: container.querySelector<HTMLInputElement>('#card-ov-border'),
      shadow: container.querySelector<HTMLInputElement>('#card-ov-shadow'),
    };

    const sync = () => {
      const bCfg = api.getConfig().card;
      if (inputs.bg) inputs.bg.value = bCfg?.overrides?.bg ?? '';
      if (inputs.radius) inputs.radius.value = bCfg?.overrides?.radius ?? '';
      if (inputs.padding) inputs.padding.value = bCfg?.overrides?.padding ?? '';
      if (inputs.border) inputs.border.value = bCfg?.overrides?.border ?? '';
      if (inputs.shadow) inputs.shadow.value = bCfg?.overrides?.shadow ?? '';
    };

    const onChange = () => {
      const overrides = {
        bg: inputs.bg?.value.trim() ? inputs.bg.value.trim() : undefined,
        radius: inputs.radius?.value.trim() ? inputs.radius.value.trim() : undefined,
        padding: inputs.padding?.value.trim() ? inputs.padding.value.trim() : undefined,
        border: inputs.border?.value.trim() ? inputs.border.value.trim() : undefined,
        shadow: inputs.shadow?.value.trim() ? inputs.shadow.value.trim() : undefined,
      };
      api.updateConfig((cfg) => ({ ...cfg, card: { overrides } }));
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

export const cardPreviewModule = {
  id: 'card',
  title: 'Card',
  render: () => `
    <div class="card">
      <h3 class="text-base" style="margin-top:0;">Card title</h3>
      <p class="text-sm" style="margin:0;">Body copy for card preview.</p>
    </div>
  `,
};

export const cardDefaults = {
  card: {},
};

import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    table: {
      cellPaddingX?: string;
      cellPaddingY?: string;
      borderWeight?: string;
      striped?: boolean;
      hoverEffect?: boolean;
    };
  }
}

export const tableCompilerEntry = {
  id: 'table' as const,
  title: 'Table',
  isEnabled: (_config: ThemeConfig) => true,
  emitComponents: (config: ThemeConfig) => {
    const tCfg = config.table;
    const px = tCfg?.cellPaddingX ?? '1rem';
    const py = tCfg?.cellPaddingY ?? '0.75rem';
    const borderWeight = tCfg?.borderWeight ?? '1px';
    const striped = tCfg?.striped ?? false;
    const hoverEffect = tCfg?.hoverEffect ?? true;

    const stripedStyles = striped
      ? `
.table tr:nth-child(even) {
  background: color-mix(in srgb, var(--surface-card, #0f1729) 40%, transparent);
}`
      : '';

    const hoverStyles = hoverEffect
      ? `
.table tr:hover {
  background: color-mix(in srgb, var(--surface-card, #0f1729) 70%, transparent);
}`
      : '';

    return `
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm-size, 0.875rem);
}
.table th,
.table td {
  padding: ${py} ${px};
  border-bottom: ${borderWeight} solid color-mix(in srgb, var(--color-neutral-900, #0f172a) 60%, transparent);
  text-align: left;
}
.table th {
  font-weight: 700;
  color: var(--surface-fg, #e7ecff);
}
${stripedStyles}
${hoverStyles}
`;
  },
};

export const tableControlModule: ControlModule = {
  id: 'table',
  title: 'Table',
  mount: (container, api) => {
    container.innerHTML = `
      <div class="control-grid">
        <div class="control-group">
          <label for="table-px">Horizontal Padding</label>
          <div class="range-with-value">
            <input id="table-px" name="cellPaddingX" type="range" min="4" max="32" step="2" />
            <span class="range-value" id="table-px-val">16px</span>
          </div>
        </div>
        <div class="control-group">
          <label for="table-py">Vertical Padding</label>
          <div class="range-with-value">
            <input id="table-py" name="cellPaddingY" type="range" min="4" max="24" step="2" />
            <span class="range-value" id="table-py-val">12px</span>
          </div>
        </div>
        <div class="control-group">
          <label for="table-border">Border Weight</label>
          <div class="range-with-value">
            <input id="table-border" name="borderWeight" type="range" min="0" max="4" step="1" />
            <span class="range-value" id="table-border-val">1px</span>
          </div>
        </div>
      </div>

      <div class="control-divider">Toggles</div>
      <div class="control-grid">
        <div class="control-group" style="flex-direction: row; align-items: center; gap: 8px;">
          <input id="table-striped" name="striped" type="checkbox" />
          <label for="table-striped" style="margin: 0;">Row Striping</label>
        </div>
        <div class="control-group" style="flex-direction: row; align-items: center; gap: 8px;">
          <input id="table-hover" name="hoverEffect" type="checkbox" />
          <label for="table-hover" style="margin: 0;">Hover Effect</label>
        </div>
      </div>
    `;

    const inputs = {
      px: container.querySelector<HTMLInputElement>('#table-px'),
      py: container.querySelector<HTMLInputElement>('#table-py'),
      border: container.querySelector<HTMLInputElement>('#table-border'),
      striped: container.querySelector<HTMLInputElement>('#table-striped'),
      hover: container.querySelector<HTMLInputElement>('#table-hover'),
    };

    const values = {
      px: container.querySelector<HTMLElement>('#table-px-val'),
      py: container.querySelector<HTMLElement>('#table-py-val'),
      border: container.querySelector<HTMLElement>('#table-border-val'),
    };

    const sync = () => {
      const cfg = api.getConfig();
      const tCfg = cfg.table;
      if (!tCfg) return;

      const setRange = (input: HTMLInputElement | null, val: string, valueEl: HTMLElement | null) => {
        if (!input) return;
        const numeric = Number.parseInt(val, 10);
        input.value = String(numeric);
        if (valueEl) valueEl.textContent = `${numeric}px`;
      };

      setRange(inputs.px, tCfg.cellPaddingX ?? '16', values.px);
      setRange(inputs.py, tCfg.cellPaddingY ?? '12', values.py);
      setRange(inputs.border, tCfg.borderWeight ?? '1', values.border);

      if (inputs.striped) inputs.striped.checked = !!tCfg.striped;
      if (inputs.hover) inputs.hover.checked = tCfg.hoverEffect !== false;
    };

    const onChange = () => {
      const cellPaddingX = `${inputs.px?.value}px`;
      const cellPaddingY = `${inputs.py?.value}px`;
      const borderWeight = `${inputs.border?.value}px`;
      const striped = !!inputs.striped?.checked;
      const hoverEffect = !!inputs.hover?.checked;

      api.updateConfig((cfg) => ({
        ...cfg,
        table: { cellPaddingX, cellPaddingY, borderWeight, striped, hoverEffect },
      }));
    };

    [inputs.px, inputs.py, inputs.border].forEach((i) => i?.addEventListener('input', onChange));
    [inputs.striped, inputs.hover].forEach((i) => i?.addEventListener('change', onChange));

    const unsubscribe = api.subscribe(sync);
    sync();

    return () => {
      unsubscribe();
      [inputs.px, inputs.py, inputs.border].forEach((i) => i?.removeEventListener('input', onChange));
      [inputs.striped, inputs.hover].forEach((i) => i?.removeEventListener('change', onChange));
    };
  },
};

export const tablePreviewModule = {
  id: 'table',
  title: 'Data Table',
  render: () => `
    <table class="table">
      <thead>
        <tr>
          <th>User</th>
          <th>Plan</th>
          <th>Activity</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Aris Totle</td>
          <td>Enterprise</td>
          <td>2m ago</td>
          <td><span style="color: var(--color-success-500); font-weight: 600;">Active</span></td>
        </tr>
        <tr>
          <td>Plato</td>
          <td>Pro</td>
          <td>1h ago</td>
          <td><span style="color: var(--color-success-500); font-weight: 600;">Active</span></td>
        </tr>
        <tr>
          <td>Socrates</td>
          <td>Free</td>
          <td>5d ago</td>
          <td><span style="opacity: 0.6;">Inactive</span></td>
        </tr>
        <tr>
          <td>Epicurus</td>
          <td>Pro</td>
          <td>Just now</td>
          <td><span style="color: var(--color-success-500); font-weight: 600;">Active</span></td>
        </tr>
      </tbody>
    </table>
  `,
};

export const tableDefaults = {
  table: {
    cellPaddingX: '16px',
    cellPaddingY: '12px',
    borderWeight: '1px',
    striped: true,
    hoverEffect: true,
  },
};

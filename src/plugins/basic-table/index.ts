import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    table: Record<string, never>;
  }
}

export const tableCompilerEntry = {
  id: 'table' as const,
  title: 'Table',
  isEnabled: (_config: ThemeConfig) => true,
  emitComponents: () => `
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm-size, 0.875rem);
}
.table th,
.table td {
  padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
  border-bottom: 1px solid color-mix(in srgb, var(--color-neutral-900, #0f172a) 60%, transparent);
  text-align: left;
}
.table th {
  font-weight: 700;
  color: var(--surface-fg, #e7ecff);
}
.table tr:hover {
  background: color-mix(in srgb, var(--surface-card, #0f1729) 70%, transparent);
}
`,
};

export const tableControlModule: ControlModule = {
  id: 'table',
  title: 'Table',
  mount: (container) => {
    container.innerHTML = `
      <p class="controls-placeholder">
        Table controls will be added here (density, borders).
      </p>
    `;
  },
};

export const tablePreviewModule = {
  id: 'table',
  title: 'Table',
  render: () => `
    <table class="table">
      <thead><tr><th>Name</th><th>Status</th><th>Role</th></tr></thead>
      <tbody>
        <tr><td>Ada</td><td>Active</td><td>Admin</td></tr>
        <tr><td>Lin</td><td>Invited</td><td>Editor</td></tr>
        <tr><td>Sam</td><td>Suspended</td><td>Viewer</td></tr>
      </tbody>
    </table>
  `,
};

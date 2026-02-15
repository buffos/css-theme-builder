import type { PreviewModule } from '../../app/preview-registry';
import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    sandbox: {
      html: string;
    };
  }
}

export const sandboxControlModule: ControlModule = {
  id: 'sandbox',
  title: 'Custom HTML Sandbox',
  mount: (container, api) => {
    const sync = () => {
      const cfg = api.getConfig();
      const s = cfg.sandbox;
      if (!s) return;

      container.innerHTML = `
        <div class="control-group">
          <label for="sandbox-html">Custom Markup (HTML)</label>
          <textarea id="sandbox-html" style="width: 100%; min-height: 300px; font-family: monospace; font-size: 12px; padding: 12px; border-radius: 8px; border: 1px solid rgba(128,128,128,0.2); background: var(--surface-card); color: var(--on-background); resize: vertical; line-height: 1.5;" placeholder="Paste your HTML here...">${s.html}</textarea>
        </div>
        <p class="controls-hint" style="font-size: 11px; opacity: 0.6; margin-top: 8px;">
          Changes are applied instantly to the Sandbox preview tab. You can use any CSS variables from your theme here.
        </p>
      `;

      const textarea = container.querySelector<HTMLTextAreaElement>('#sandbox-html');
      textarea?.addEventListener('input', (e) => {
        const val = (e.target as HTMLTextAreaElement).value;
        api.updateConfig(prev => ({
          ...prev,
          sandbox: { html: val }
        }));
      });
    };

    const unsubscribe = api.subscribe(sync);
    sync();

    return unsubscribe;
  }
};

export const sandboxPreviewModule: PreviewModule = {
  id: 'sandbox',
  title: 'Sandbox Preview',
  render: (config: ThemeConfig) => {
    const html = config.sandbox?.html || '<p style="opacity: 0.5; text-align: center; padding: 2rem;">No custom HTML provided. Use the controls to add some!</p>';
    return `
      <div class="sandbox-wrapper">
        ${html}
      </div>
    `;
  }
};

export const sandboxDefaults = {
  sandbox: {
    html: `
<section style="display: flex; flex-direction: column; gap: 1.5rem; padding: 1rem;">
  <div style="background: var(--surface-card); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid rgba(128,128,128,0.1); box-shadow: var(--shadow-md);">
    <h2 style="margin: 0 0 1rem 0; font-size: var(--text-2xl-size); color: var(--color-primary-500);">Welcome to the Sandbox</h2>
    <p style="margin: 0 0 1.5rem 0; opacity: 0.8; line-height: 1.6;"> This is a custom HTML area where you can test how your design tokens feel on real-world markup. All <b>--color-*</b>, <b>--radius-*</b>, and <b>--duration-*</b> variables are available!</p>
    
    <div style="display: flex; gap: 0.75rem;">
      <button class="btn btn--primary">Get Started</button>
      <button class="btn" style="background: transparent; border: 1px solid var(--color-primary-500); color: var(--color-primary-500);">Learn More</button>
    </div>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
    <div style="padding: 1rem; border-radius: var(--radius-md); background: var(--color-success-500); color: var(--on-success);">
      Success Notification
    </div>
    <div style="padding: 1rem; border-radius: var(--radius-md); background: var(--color-danger-500); color: var(--on-danger);">
      Error Warning
    </div>
  </div>
</section>
    `.trim()
  }
};

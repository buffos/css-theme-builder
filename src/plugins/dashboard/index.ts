import type { PreviewModule } from '../../app/preview-registry';
import type { ThemeConfig } from '../../compiler/types';

export const dashboardPreviewModule: PreviewModule = {
  id: 'dashboard',
  title: 'Design System Overview',
  render: (_config: ThemeConfig) => {
    return `
      <div style="display: flex; flex-direction: column; gap: 2rem; color: var(--on-background);">
        <!-- Colors Section -->
        <section>
          <h4 style="margin: 0 0 1rem 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6;">Color Palette</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem;">
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <div style="height: 48px; background: var(--color-primary-500); border-radius: 6px; border: 1px solid rgba(128,128,128,0.2);"></div>
              <span style="font-size: 11px; font-weight: 600;">Primary 500</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <div style="height: 48px; background: var(--color-primary-600); border-radius: 6px; border: 1px solid rgba(128,128,128,0.2);"></div>
              <span style="font-size: 11px; font-weight: 600;">Primary 600</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <div style="height: 48px; background: var(--color-danger-500); border-radius: 6px; border: 1px solid rgba(128,128,128,0.2);"></div>
              <span style="font-size: 11px; font-weight: 600;">Danger</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <div style="height: 48px; background: var(--color-success-500); border-radius: 6px; border: 1px solid rgba(128,128,128,0.2);"></div>
              <span style="font-size: 11px; font-weight: 600;">Success</span>
            </div>
          </div>
        </section>

        <!-- Typography Section -->
        <section>
          <h4 style="margin: 0 0 1rem 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6;">Typography Scale</h4>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="font-size: var(--text-3xl-size); line-height: var(--text-3xl-line-height);">3XL Heading</div>
            <div style="font-size: var(--text-xl-size); line-height: var(--text-xl-line-height);">XL Subheading</div>
            <div style="font-size: var(--text-base-size); line-height: var(--text-base-line-height);">Base Body Text</div>
            <div style="font-size: var(--text-sm-size); line-height: var(--text-sm-line-height);">Small Caption Text</div>
          </div>
        </section>

        <!-- Radius & Spacing Section -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
          <section>
            <h4 style="margin: 0 0 1rem 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6;">Radius Scale</h4>
            <div style="display: flex; gap: 1rem;">
              <div style="width: 40px; height: 40px; background: var(--color-neutral-900); border-radius: var(--radius-sm); border: 1px solid rgba(128,128,128,0.1); display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--color-neutral-50);">SM</div>
              <div style="width: 40px; height: 40px; background: var(--color-neutral-900); border-radius: var(--radius-md); border: 1px solid rgba(128,128,128,0.1); display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--color-neutral-50);">MD</div>
              <div style="width: 40px; height: 40px; background: var(--color-neutral-900); border-radius: var(--radius-lg); border: 1px solid rgba(128,128,128,0.1); display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--color-neutral-50);">LG</div>
            </div>
          </section>
          
          <section>
            <h4 style="margin: 0 0 1rem 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6;">Spacing Units</h4>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <div style="width: var(--space-2); height: 8px; background: var(--color-primary-500); border-radius: 2px;"></div>
              <div style="width: var(--space-4); height: 8px; background: var(--color-primary-500); border-radius: 2px;"></div>
              <div style="width: var(--space-8); height: 8px; background: var(--color-primary-500); border-radius: 2px;"></div>
              <div style="width: var(--space-12); height: 8px; background: var(--color-primary-500); border-radius: 2px;"></div>
            </div>
          </section>
        </div>

        <!-- Shadows & Surfaces Section -->
        <section>
          <h4 style="margin: 0 0 1rem 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6;">Elevation & Depth</h4>
          <div style="background: var(--surface-bg); color: var(--on-background); padding: 1.5rem; border-radius: 8px; border: 1px solid rgba(128,128,128,0.1); display: flex; gap: 1.5rem; flex-wrap: wrap;">
             <div style="background: var(--surface-card); color: var(--on-card); padding: 1rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border: 1px solid rgba(128,128,128,0.1); font-size: 12px;">SM Shadow</div>
             <div style="background: var(--surface-card); color: var(--on-card); padding: 1rem; border-radius: var(--radius-md); box-shadow: var(--shadow-md); border: 1px solid rgba(128,128,128,0.1); font-size: 12px;">MD Shadow</div>
             <div style="background: var(--surface-card); color: var(--on-card); padding: 1rem; border-radius: var(--radius-md); box-shadow: var(--shadow-lg); border: 1px solid rgba(128,128,128,0.1); font-size: 12px;">LG Shadow</div>
          </div>
        </section>
      </div>
    `;
  }
};

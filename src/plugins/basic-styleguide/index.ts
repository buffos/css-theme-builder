import type { PreviewModule } from '../../app/preview-registry';
import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

export const styleguideControlModule: ControlModule = {
  id: 'styleguide',
  title: 'Style Guide',
  mount: (container) => {
    container.innerHTML = `
      <p class="controls-placeholder">
        View a detailed technical specification of all design tokens, foundations, and component variables in the live preview.
      </p>
      <div style="padding: 1rem; background: var(--surface-bg); border-radius: 8px; border: 1px solid rgba(128,128,128,0.1); font-size: 11px; opacity: 0.8;">
        This view is auto-generated based on your current theme configuration. Use it to hand off specs to developers.
      </div>
      <div style="margin-top: 1rem; padding: 0.75rem; background: var(--color-primary-500); color: var(--on-primary); border-radius: 8px; font-size: 10px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
        <span>💡 Tip: Click any token name to copy its CSS variable.</span>
      </div>
    `;
  }
};

export const styleguidePreviewModule: PreviewModule = {
  id: 'styleguide',
  title: 'Style Guide & Spec',
  render: (config: ThemeConfig) => {
    const spacingKeys = Object.keys(config.spacing ?? {}).sort((a, b) => Number(a) - Number(b));
    const radiusKeys = Object.keys(config.radius ?? {}).sort((a, b) => a.localeCompare(b));
    const shadowKeys = Object.keys(config.shadow ?? {}).sort((a, b) => a.localeCompare(b));

    const colorSwatches = (name: string, prefix: string) => `
      <div style="margin-bottom: 2rem;">
        <h5 style="margin: 0 0 1rem 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6;">${name}</h5>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.75rem;">
          ${[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(step => `
            <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem; background: var(--surface-card); border: 1px solid rgba(128,128,128,0.1); border-radius: 6px;">
              <div style="width: 32px; height: 32px; background: var(--${prefix}-${step}); border-radius: 4px; border: 1px solid rgba(128,128,128,0.2);"></div>
              <div style="display: flex; flex-direction: column;">
                <span style="font-size: 11px; font-weight: 700;">${step}</span>
                <code class="token-code" onclick="copyToken('--${prefix}-${step}')">--${prefix}-${step}</code>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    return `
      <style>
        .token-code {
          font-size: 9px; 
          opacity: 0.6; 
          cursor: pointer; 
          transition: all 0.2s ease;
          padding: 2px 4px;
          border-radius: 4px;
        }
        .token-code:hover {
          opacity: 1;
          background: var(--color-primary-500);
          color: var(--on-primary);
        }
        .token-code:active {
          transform: scale(0.95);
        }
        #copy-toast {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%) translateY(100px);
          background: #0f172a;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 9999;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        #copy-toast.show {
          transform: translateX(-50%) translateY(0);
        }
      </style>

      <script>
        window.copyToken = (text) => {
          navigator.clipboard.writeText(text).then(() => {
            const toast = document.getElementById('copy-toast');
            toast.textContent = 'Copied: ' + text;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
          });
        };
      </script>

      <div id="copy-toast">Copied!</div>

      <div style="display: flex; flex-direction: column; gap: 3rem; color: var(--on-background); font-family: var(--font-family, sans-serif);">
        
        <!-- TYPOGRAPHY SPEC -->
        <section>
          <h4 style="margin: 0 0 1.5rem 0; font-size: 13px; font-weight: 800; border-bottom: 2px solid var(--color-primary-500); padding-bottom: 0.5rem; display: inline-block;">TYPOGRAPHY SPEC</h4>
          <div style="display: grid; gap: 1.5rem;">
            ${['3xl', '2xl', 'xl', 'lg', 'base', 'sm'].map(size => `
              <div style="display: grid; grid-template-columns: 100px 1fr; align-items: baseline; gap: 2rem; padding: 1rem; background: var(--surface-card); border-radius: 8px; border: 1px solid rgba(128,128,128,0.1);">
                <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                  <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; opacity: 0.5;">${size}</span>
                  <code class="token-code" style="font-size: 10px;" onclick="copyToken('--text-${size}-size')">--text-${size}-size</code>
                </div>
                <div style="font-size: var(--text-${size}-size); line-height: var(--text-${size}-line-height);">
                  The quick brown fox jumps over the lazy dog.
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- COLOR SYSTEMS -->
        <section>
          <h4 style="margin: 0 0 1.5rem 0; font-size: 13px; font-weight: 800; border-bottom: 2px solid var(--color-primary-500); padding-bottom: 0.5rem; display: inline-block;">COLOR SYSTEMS</h4>
          ${colorSwatches('Primary Palette', 'color-primary')}
          ${colorSwatches('Secondary Palette', 'color-secondary')}
          ${colorSwatches('Tertiary Palette', 'color-tertiary')}
          ${colorSwatches('Neutral Palette', 'color-neutral')}
          
          <div style="margin-top: 2rem;">
            <h5 style="margin: 0 0 1rem 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6;">Semantic Roles</h5>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
              ${['success', 'warning', 'danger', 'info'].map(role => `
                <div style="padding: 1rem; background: var(--surface-card); border-radius: 8px; border: 1px solid rgba(128,128,128,0.1); display: flex; flex-direction: column; gap: 0.75rem;">
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span style="font-size: 12px; font-weight: 800; text-transform: capitalize;">${role}</span>
                    <div style="width: 12px; height: 12px; border-radius: 50%; background: var(--color-${role}-500);"></div>
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                    <div class="token-code" style="height: 32px; background: var(--color-${role}-500); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: var(--on-${role});" onclick="copyToken('var(--color-${role}-500)')">Solid</div>
                    <div class="token-code" style="height: 32px; background: color-mix(in srgb, var(--color-${role}-500) 15%, transparent); border: 1px solid var(--color-${role}-500); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: var(--color-${role}-600);" onclick="copyToken('var(--color-${role}-600)')">Soft</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- LAYOUT & RESPONSIVE -->
        <section>
          <h4 style="margin: 0 0 1.5rem 0; font-size: 13px; font-weight: 800; border-bottom: 2px solid var(--color-primary-500); padding-bottom: 0.5rem; display: inline-block;">LAYOUT & RESPONSIVE</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
            
            <!-- Breakpoints -->
            <div style="padding: 1.25rem; background: var(--surface-card); border-radius: 10px; border: 1px solid rgba(128,128,128,0.1);">
              <h5 style="margin: 0 0 1rem 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6;">Breakpoints</h5>
              <div style="display: grid; gap: 0.75rem;">
                ${['sm', 'md', 'lg', 'xl'].map(bp => `
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; flex-direction: column;">
                      <span style="font-size: 11px; font-weight: 800;">${bp.toUpperCase()}</span>
                      <code class="token-code" onclick="copyToken('--breakpoint-${bp}')">--breakpoint-${bp}</code>
                    </div>
                    <span style="font-size: 11px; font-weight: 700; color: var(--color-primary-500);">${config.layout?.breakpoints[bp as keyof typeof config.layout.breakpoints]}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Global Layout -->
            <div style="padding: 1.25rem; background: var(--surface-card); border-radius: 10px; border: 1px solid rgba(128,128,128,0.1); display: flex; flex-direction: column; gap: 1rem;">
              <h5 style="margin: 0 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6;">Global Layout</h5>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; flex-direction: column;">
                  <span style="font-size: 11px; font-weight: 800;">Container Max</span>
                  <code class="token-code" onclick="copyToken('--container-width')">--container-width</code>
                </div>
                <span style="font-size: 11px; font-weight: 700; color: var(--color-primary-500);">${config.layout?.container}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; flex-direction: column;">
                  <span style="font-size: 11px; font-weight: 800;">Grid Gutter</span>
                  <code class="token-code" onclick="copyToken('--layout-gutter')">--layout-gutter</code>
                </div>
                <span style="font-size: 11px; font-weight: 700; color: var(--color-primary-500);">${config.layout?.gutter}</span>
              </div>
            </div>

          </div>
        </section>

        <!-- FOUNDATIONS -->
        <section>
          <h4 style="margin: 0 0 1.5rem 0; font-size: 13px; font-weight: 800; border-bottom: 2px solid var(--color-primary-500); padding-bottom: 0.5rem; display: inline-block;">SYSTEM FOUNDATIONS</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;">
            
            <!-- Radii Spec -->
            <div style="padding: 1.5rem; background: var(--surface-card); border-radius: 12px; border: 1px solid rgba(128,128,128,0.1);">
              <h5 style="margin: 0 0 1rem 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6;">Rounding (Radius)</h5>
              <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
                ${radiusKeys.map(key => `
                  <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: center;">
                    <div style="width: 48px; height: 48px; background: var(--color-primary-500); border-radius: var(--radius-${key});"></div>
                    <code class="token-code" onclick="copyToken('--radius-${key}')">${key}</code>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Shadow Spec -->
            <div style="padding: 1.5rem; background: var(--surface-card); border-radius: 12px; border: 1px solid rgba(128,128,128,0.1);">
              <h5 style="margin: 0 0 1rem 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6;">Elevation (Shadows)</h5>
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                ${shadowKeys.map(key => `
                  <div style="height: 60px; background: var(--surface-bg); border-radius: 8px; box-shadow: var(--shadow-${key}); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(128,128,128,0.05);">
                    <code class="token-code" style="font-weight: 800;" onclick="copyToken('--shadow-${key}')">${key.toUpperCase()}</code>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Spacing Spec -->
            <div style="grid-column: 1 / -1; padding: 1.5rem; background: var(--surface-card); border-radius: 12px; border: 1px solid rgba(128,128,128,0.1);">
              <h5 style="margin: 0 0 1rem 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6;">Spacing Units</h5>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem;">
                ${spacingKeys.map(key => `
                  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <div style="width: var(--space-${key}); height: 8px; background: var(--color-primary-500); border-radius: 2px;"></div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span style="font-size: 10px; font-weight: 700;">${key}</span>
                      <code class="token-code" onclick="copyToken('--space-${key}')">var(--space-${key})</code>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Elevation (Z-Index) Spec -->
            <div style="grid-column: 1 / -1; padding: 1.5rem; background: var(--surface-card); border-radius: 12px; border: 1px solid rgba(128,128,128,0.1);">
              <h5 style="margin: 0 0 1rem 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6;">Z-Index Layers</h5>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem;">
                ${Object.entries(config.elevation ?? {}).sort(([, a], [, b]) => a - b).map(([key, val]) => `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--surface-bg); border-radius: 6px; border: 1px solid rgba(128,128,128,0.05);">
                    <div style="display: flex; flex-direction: column;">
                      <span style="font-size: 10px; font-weight: 800; color: var(--color-primary-500);">${key.toUpperCase()}</span>
                      <code class="token-code" onclick="copyToken('--z-index-${key}')">--z-index-${key}</code>
                    </div>
                    <span style="font-size: 11px; font-weight: 900; opacity: 0.8;">${val}</span>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>
        </section>

        <!-- ICONOGRAPHY SPEC -->
        <section>
          <h4 style="margin: 0 0 1.5rem 0; font-size: 13px; font-weight: 800; border-bottom: 2px solid var(--color-primary-500); padding-bottom: 0.5rem; display: inline-block;">ICONOGRAPHY SPEC</h4>
          <div style="display: grid; gap: 2rem;">
            
            <div style="padding: 1.5rem; background: var(--surface-card); border-radius: 12px; border: 1px solid rgba(128,128,128,0.1);">
              <h5 style="margin: 0 0 1.5rem 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6;">Size Scale</h5>
              <div style="display: flex; align-items: flex-end; gap: 2rem; flex-wrap: wrap;">
                ${Object.entries(config.icons?.sizes ?? {}).map(([key, val]) => `
                  <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
                    <div style="width: var(--icon-size-${key}); height: var(--icon-size-${key}); color: var(--color-primary-500);">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: center;">
                      <span style="font-size: 10px; font-weight: 800;">${key.toUpperCase()}</span>
                      <code class="token-code" onclick="copyToken('--icon-size-${key}')">${val}</code>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div style="padding: 1.5rem; background: var(--surface-card); border-radius: 12px; border: 1px solid rgba(128,128,128,0.1);">
              <h5 style="margin: 0 0 1.5rem 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6;">Stroke Weight</h5>
              <div style="display: flex; gap: 3rem; flex-wrap: wrap;">
                ${Object.entries(config.icons?.stroke ?? {}).map(([key, val]) => `
                  <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="width: 32px; height: 32px; color: var(--color-primary-500);">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="var(--icon-stroke-${key})" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    </div>
                    <div style="display: flex; flex-direction: column;">
                      <span style="font-size: 10px; font-weight: 800;">${key.toUpperCase()}</span>
                      <code class="token-code" onclick="copyToken('--icon-stroke-${key}')">${val}px</code>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>
        </section>

        <!-- MOTION SPEC -->
        <section>
          <h4 style="margin: 0 0 1.5rem 0; font-size: 13px; font-weight: 800; border-bottom: 2px solid var(--color-primary-500); padding-bottom: 0.5rem; display: inline-block;">MOTION SPEC</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
            <div style="padding: 1.25rem; background: var(--surface-card); border-radius: 10px; border: 1px solid rgba(128,128,128,0.1);">
              <h5 style="margin: 0 0 1rem 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6;">Duration Tokens</h5>
              <div style="display: grid; gap: 0.75rem;">
                ${['fast', 'base', 'slow'].map(d => `
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; flex-direction: column;">
                      <span style="font-size: 11px; font-weight: 800;">${d.toUpperCase()}</span>
                      <code class="token-code" onclick="copyToken('--duration-${d}')">--duration-${d}</code>
                    </div>
                    <span style="font-size: 11px; font-weight: 700; color: var(--color-primary-500);">${config.motion?.durations[d as keyof typeof config.motion.durations]}ms</span>
                  </div>
                `).join('')}
              </div>
            </div>
            <div style="padding: 1.25rem; background: var(--surface-card); border-radius: 10px; border: 1px solid rgba(128,128,128,0.1);">
              <h5 style="margin: 0 0 1rem 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6;">Easing Curves</h5>
              <div style="display: grid; gap: 0.75rem;">
                ${['in', 'out', 'inOut'].map(e => `
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; flex-direction: column;">
                      <span style="font-size: 11px; font-weight: 800;">${e.toUpperCase()}</span>
                      <code class="token-code" onclick="copyToken('--ease-${e.replace(/[A-Z]/, m => '-' + m.toLowerCase())}')">--ease-${e.replace(/[A-Z]/, m => '-' + m.toLowerCase())}</code>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </section>

      </div>
    `;
  }
};

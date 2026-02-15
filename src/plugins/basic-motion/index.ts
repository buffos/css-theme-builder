import type { PreviewModule } from '../../app/preview-registry';
import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';

declare module '../../compiler/types' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeModules {
    motion: {
      durations: {
        fast: number;
        base: number;
        slow: number;
      };
      easing: {
        in: string;
        out: string;
        inOut: string;
      };
    };
  }
}

export const motionCompilerEntry = {
  id: 'motion' as const,
  title: 'Motion',
  isEnabled: (config: ThemeConfig) => Boolean(config.motion),
  emitTokens: (config: ThemeConfig) => {
    const m = config.motion;
    if (!m) return '';

    return `
  --duration-fast: ${m.durations.fast}ms;
  --duration-base: ${m.durations.base}ms;
  --duration-slow: ${m.durations.slow}ms;
  
  --ease-in: ${m.easing.in};
  --ease-out: ${m.easing.out};
  --ease-in-out: ${m.easing.inOut};
`;
  },
  emitUtilities: () => `
  .transition-base { transition: all var(--duration-base) var(--ease-in-out); }
  .transition-fast { transition: all var(--duration-fast) var(--ease-out); }
  `,
};

export const motionDefaults = {
  motion: {
    durations: {
      fast: 150,
      base: 300,
      slow: 500,
    },
    easing: {
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
};

export const motionControlModule: ControlModule = {
  id: 'motion',
  title: 'Motion & Animation',
  mount: (container, api) => {
    const sync = () => {
      const cfg = api.getConfig();
      const m = cfg.motion || motionDefaults.motion;

      container.innerHTML = `
        <div class="control-group">
          <label>Base Duration: <span>${m.durations.base}ms</span></label>
          <input type="range" id="motion-base" min="50" max="1000" step="10" value="${m.durations.base}" />
        </div>
        <div class="control-grid" style="grid-template-columns: 1fr 1fr; gap: 8px;">
           <div class="control-group">
            <label>Fast</label>
            <input type="number" id="motion-fast" value="${m.durations.fast}" style="width: 100%;" />
          </div>
          <div class="control-group">
            <label>Slow</label>
            <input type="number" id="motion-slow" value="${m.durations.slow}" style="width: 100%;" />
          </div>
        </div>
        <div class="control-group">
          <label>Easing (In-Out)</label>
          <select id="ease-in-out">
            <option value="cubic-bezier(0.4, 0, 0.2, 1)" ${m.easing.inOut === 'cubic-bezier(0.4, 0, 0.2, 1)' ? 'selected' : ''}>Standard</option>
            <option value="ease-in-out" ${m.easing.inOut === 'ease-in-out' ? 'selected' : ''}>Linear-ish</option>
            <option value="cubic-bezier(0.34, 1.56, 0.64, 1)" ${m.easing.inOut === 'cubic-bezier(0.34, 1.56, 0.64, 1)' ? 'selected' : ''}>Bouncy</option>
          </select>
        </div>
      `;

      const update = (key: string, val: string | number) => {
        api.updateConfig(prev => {
          const next = { ...prev };
          if (!next.motion) next.motion = { ...motionDefaults.motion };
          if (key === 'base') next.motion.durations.base = Number(val);
          if (key === 'fast') next.motion.durations.fast = Number(val);
          if (key === 'slow') next.motion.durations.slow = Number(val);
          if (key === 'ease-in-out') next.motion.easing.inOut = String(val);
          return next;
        });
      };

      container.querySelector('#motion-base')?.addEventListener('input', (e) => update('base', (e.target as HTMLInputElement).value));
      container.querySelector('#motion-fast')?.addEventListener('input', (e) => update('fast', (e.target as HTMLInputElement).value));
      container.querySelector('#motion-slow')?.addEventListener('input', (e) => update('slow', (e.target as HTMLInputElement).value));
      container.querySelector('#ease-in-out')?.addEventListener('change', (e) => update('ease-in-out', (e.target as HTMLSelectElement).value));
    };

    const unsubscribe = api.subscribe(sync);
    sync();
    return unsubscribe;
  }
};

export const motionPreviewModule: PreviewModule = {
  id: 'motion',
  title: 'Motion Gallery',
  render: () => `
    <style>
      .motion-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
      .motion-card { 
        padding: 20px; background: var(--surface-card); border-radius: 8px; border: 1px solid rgba(128,128,128,0.1);
        display: flex; flex-direction: column; gap: 16px;
      }
      .test-box {
        width: 40px; height: 40px; background: var(--color-primary-500); border-radius: 6px;
        transition: transform var(--duration-base) var(--ease-in-out);
      }
      .motion-card:hover .test-box {
        transform: translateX(100px) rotate(90deg);
      }
      .easing-viz {
        height: 4px; background: rgba(128,128,128,0.1); border-radius: 2px; position: relative; overflow: hidden;
      }
      .easing-viz::after {
        content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 20px;
        background: var(--color-primary-500);
        animation: slide var(--duration-slow) var(--ease-in-out) infinite alternate;
      }
      @keyframes slide { from { left: 0; } to { left: calc(100% - 20px); } }
    </style>
    <div class="motion-grid">
      <div class="motion-card">
        <div style="font-size: 11px; font-weight: 800; opacity: 0.6; text-transform: uppercase;">Standard Transition</div>
        <div class="test-box"></div>
        <div style="font-size: 10px; opacity: 0.5;">Hover to test --duration-base</div>
      </div>
      <div class="motion-card">
        <div style="font-size: 11px; font-weight: 800; opacity: 0.6; text-transform: uppercase;">Easing Visualization</div>
        <div class="easing-viz"></div>
        <div style="font-size: 10px; opacity: 0.5;">Continuous loop with --duration-slow</div>
      </div>
    </div>
  `
};

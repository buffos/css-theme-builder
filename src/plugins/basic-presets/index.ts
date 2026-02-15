import type { ControlModule } from '../../app/registry';
import { buildThemeConfig, type PartialThemeConfig } from '../../compiler/types';

import { THEME_PRESETS } from './presets';

const renderPresetCard = (id: string, preset: PartialThemeConfig, activeName: string) => {
  const isActive = activeName === preset.name;
  const primary = preset.colors?.primary?.[500] ?? '#ccc';
  const neutral = preset.colors?.neutral?.[50] ?? '#fff';
  const neutral900 = preset.colors?.neutral?.[900] ?? '#000';
  
  return `
    <div class="preset-card ${isActive ? 'active' : ''}" 
         data-id="${id}"
         style="cursor: pointer; padding: 12px; border-radius: 12px; border: 2px solid ${isActive ? 'var(--color-primary-500)' : 'rgba(128,128,128,0.1)'}; background: var(--surface-card); transition: all 0.2s ease; position: relative; overflow: hidden;">
      <div style="display: flex; gap: 6px; margin-bottom: 8px;">
        <div style="width: 24px; height: 24px; border-radius: 50%; background: ${primary}; border: 1px solid rgba(0,0,0,0.1);"></div>
        <div style="width: 24px; height: 24px; border-radius: 50%; background: ${neutral}; border: 1px solid rgba(0,0,0,0.1);"></div>
        <div style="width: 24px; height: 24px; border-radius: 50%; background: ${neutral900}; border: 1px solid rgba(0,0,0,0.1);"></div>
      </div>
      <div style="font-size: 11px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${preset.name}</div>
      ${isActive ? '<div style="position: absolute; top: 6px; right: 6px; width: 6px; height: 6px; border-radius: 50%; background: var(--color-primary-500);"></div>' : ''}
    </div>
  `;
};

export const presetsControlModule: ControlModule = {
  id: 'presets',
  title: 'Theme Presets',
  mount: (container, api) => {
    const render = () => {
      const cfg = api.getConfig();
      const activeName = cfg.name;
      
      container.innerHTML = `
        <div class="control-group">
          <label style="margin-bottom: 12px; display: block; opacity: 0.8;">Choose a Visual Persona</label>
          <div class="presets-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            ${Object.entries(THEME_PRESETS).map(([id, preset]) => renderPresetCard(id, preset, activeName)).join('')}
          </div>
        </div>
        <p class="controls-hint" style="font-size: 11px; opacity: 0.6; margin-top: 12px;">
          Applying a preset will overwrite your current color and radius settings.
        </p>
      `;

      container.querySelectorAll<HTMLElement>('.preset-card').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.dataset.id;
          if (id && THEME_PRESETS[id]) {
            const fragment = THEME_PRESETS[id];
            api.updateConfig(current => buildThemeConfig(fragment, [current]));
            api.setActivePreview(['styleguide']);
          }
        });
      });
    };

    const unsubscribe = api.subscribe(render);
    render();

    return unsubscribe;
  }
};

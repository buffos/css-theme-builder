import type { ControlModule } from '../../app/registry';

const template = `
  <div class="control-group">
    <label for="theme-name">Theme name</label>
    <input id="theme-name" name="theme-name" type="text" />
  </div>
  <p class="controls-placeholder">
    Controls UI coming next: colors, typography, spacing, radius, shadow, mode toggle.
  </p>
`;

const bind = (root: HTMLElement, api: Parameters<ControlModule['mount']>[1]): (() => void) => {
  const nameInput = root.querySelector<HTMLInputElement>('#theme-name');

  const sync = () => {
    const cfg = api.getConfig();
    if (nameInput) nameInput.value = cfg.name;
  };

  const onNameInput = (evt: Event) => {
    const target = evt.target as HTMLInputElement;
    api.updateConfig((cfg) => ({ ...cfg, name: target.value }));
  };

  if (nameInput) {
    nameInput.addEventListener('input', onNameInput);
  }

  const unsubscribe = api.subscribe(sync);
  sync();

  return () => {
    unsubscribe();
    if (nameInput) {
      nameInput.removeEventListener('input', onNameInput);
    }
  };
};

export const themeNameControlModule: ControlModule = (() => {
  let cleanup: (() => void) | null = null;

  const mount: ControlModule['mount'] = (container, api) => {
    container.innerHTML = template;
    cleanup = bind(container, api);
  };

  const unmount = () => {
    cleanup?.();
    cleanup = null;
  };

  return {
    id: 'theme-name',
    title: 'Theme name',
    mount,
    unmount,
  };
})();

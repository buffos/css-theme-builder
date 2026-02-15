import type { ControlModule } from '../../app/registry';

const template = `
  <div class="control-grid">
    <div class="control-group">
      <label for="theme-name">Theme name</label>
      <input id="theme-name" name="name" type="text" />
    </div>
    <div class="control-group">
      <label for="theme-version">Version</label>
      <input id="theme-version" name="version" type="text" placeholder="1.0.0" />
    </div>
    <div class="control-group">
      <label for="theme-author">Author</label>
      <input id="theme-author" name="author" type="text" placeholder="Your name" />
    </div>
  </div>
`;

const bind = (root: HTMLElement, api: Parameters<ControlModule['mount']>[1]): (() => void) => {
  const inputs = root.querySelectorAll<HTMLInputElement>('input');

  const sync = () => {
    const cfg = api.getConfig();
    inputs.forEach((input) => {
      const key = input.name as 'name' | 'version' | 'author';
      if (cfg[key] !== undefined) {
        input.value = cfg[key];
      }
    });
  };

  const onInput = (evt: Event) => {
    const target = evt.target as HTMLInputElement;
    const key = target.name as 'name' | 'version' | 'author';
    api.updateConfig((cfg) => ({ ...cfg, [key]: target.value }));
  };

  inputs.forEach((input) => input.addEventListener('input', onInput));

  const unsubscribe = api.subscribe(sync);
  sync();

  return () => {
    unsubscribe();
    inputs.forEach((input) => input.removeEventListener('input', onInput));
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

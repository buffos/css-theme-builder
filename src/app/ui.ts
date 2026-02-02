import type { ControlApi, ControlsRegistry } from './registry';

const template = `
  <div class="control-group">
    <label for="theme-name">Theme name</label>
    <input id="theme-name" name="theme-name" type="text" />
  </div>
  <p class="controls-placeholder">
    Controls UI coming next: colors, typography, spacing, radius, shadow, mode toggle.
  </p>
`;

// Bind DOM elements to state updates and return a cleanup function.
const bind = (root: HTMLElement, api: ControlApi): (() => void) => {
  const nameInput = root.querySelector<HTMLInputElement>('#theme-name');

  const sync = () => {
    const cfg = api.getConfig();
    if (nameInput) nameInput.value = cfg.name;
  };

  // Mirror input changes into state via the controlApi.
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

// here we will place all controls we will build
export const controlsRegistry: ControlsRegistry = {
  // name control - controlling the theme name
  name: (() => {
    let cleanup: (() => void) | null = null;

    // replace the container with the template and register the event listener
    const mount = (container: HTMLElement, api: ControlApi) => {
      container.innerHTML = template;
      cleanup = bind(container, api);
    };

    // clean up when needed
    const unmount = () => {
      cleanup?.();
      cleanup = null;
    };

    return {
      id: 'name',
      title: 'Theme name',
      mount,
      unmount,
    };
  })(),
};

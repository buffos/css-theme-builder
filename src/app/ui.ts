import { accessibilityControlModule } from '../plugins/basic-accessibility';
import { alertControlModule } from '../plugins/basic-alert';
import { buttonsControlModule } from '../plugins/basic-buttons';
import { cardControlModule } from '../plugins/basic-card';
import { colorsControlModule } from '../plugins/basic-colors';
import { elevationControlModule } from '../plugins/basic-elevation';
import { iconsControlModule } from '../plugins/basic-icons';
import { inputsControlModule } from '../plugins/basic-inputs';
import { layoutControlModule } from '../plugins/basic-layout';
import { modalControlModule } from '../plugins/basic-modal';
import { motionControlModule } from '../plugins/basic-motion';
import { presetsControlModule } from '../plugins/basic-presets';
import { radiusControlModule } from '../plugins/basic-radius';
import { sandboxControlModule } from '../plugins/basic-sandbox';
import { shadowControlModule } from '../plugins/basic-shadow';
import { spacingControlModule } from '../plugins/basic-spacing';
import { styleguideControlModule } from '../plugins/basic-styleguide';
import { surfaceControlModule } from '../plugins/basic-surface';
import { tableControlModule } from '../plugins/basic-table';
import { themeNameControlModule } from '../plugins/basic-theme-name';
import { typographyControlModule } from '../plugins/basic-typography';

import type { ControlsRegistry } from './registry';

// here we will place all controls we will build
export const controlsRegistry: ControlsRegistry = {
  sandbox: sandboxControlModule,
  accessibility: accessibilityControlModule,
  styleguide: styleguideControlModule,
  name: themeNameControlModule,
  presets: presetsControlModule,
  layout: layoutControlModule,
  colors: colorsControlModule,
  typography: typographyControlModule,
  surface: surfaceControlModule,
  spacing: spacingControlModule,
  radius: radiusControlModule,
  shadow: shadowControlModule,
  elevation: elevationControlModule,
  icons: iconsControlModule,
  buttons: buttonsControlModule,
  inputs: inputsControlModule,
  card: cardControlModule,
  alert: alertControlModule,
  table: tableControlModule,
  modal: modalControlModule,
  motion: motionControlModule,
} satisfies ControlsRegistry;

import { alertControlModule } from '../plugins/basic-alert';
import { buttonsControlModule } from '../plugins/basic-buttons';
import { cardControlModule } from '../plugins/basic-card';
import { colorsControlModule } from '../plugins/basic-colors';
import { inputsControlModule } from '../plugins/basic-inputs';
import { layoutControlModule } from '../plugins/basic-layout';
import { modalControlModule } from '../plugins/basic-modal';
import { radiusControlModule } from '../plugins/basic-radius';
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
  name: themeNameControlModule,
  layout: layoutControlModule,
  styleguide: styleguideControlModule,
  colors: colorsControlModule,
  typography: typographyControlModule,
  surface: surfaceControlModule,
  spacing: spacingControlModule,
  radius: radiusControlModule,
  shadow: shadowControlModule,
  buttons: buttonsControlModule,
  inputs: inputsControlModule,
  card: cardControlModule,
  alert: alertControlModule,
  table: tableControlModule,
  modal: modalControlModule,
} satisfies ControlsRegistry;

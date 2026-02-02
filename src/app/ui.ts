import { colorsControlModule } from '../plugins/basic-colors';
import { radiusControlModule } from '../plugins/basic-radius';
import { shadowControlModule } from '../plugins/basic-shadow';
import { spacingControlModule } from '../plugins/basic-spacing';
import { surfaceControlModule } from '../plugins/basic-surface';
import { themeNameControlModule } from '../plugins/basic-theme-name';
import { typographyControlModule } from '../plugins/basic-typography';

import type { ControlsRegistry } from './registry';

// here we will place all controls we will build
export const controlsRegistry: ControlsRegistry = {
  name: themeNameControlModule,
  colors: colorsControlModule,
  typography: typographyControlModule,
  surface: surfaceControlModule,
  spacing: spacingControlModule,
  radius: radiusControlModule,
  shadow: shadowControlModule,
};

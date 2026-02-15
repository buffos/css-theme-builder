import type { ThemeConfig } from '../compiler/types';
import { alertPreviewModule } from '../plugins/basic-alert';
import { buttonsPreviewModule } from '../plugins/basic-buttons';
import { cardPreviewModule } from '../plugins/basic-card';
import { colorsPreviewModule } from '../plugins/basic-colors';
import { elevationPreviewModule } from '../plugins/basic-elevation';
import { iconsPreviewModule } from '../plugins/basic-icons';
import { inputsPreviewModule } from '../plugins/basic-inputs';
import { layoutPreviewModule } from '../plugins/basic-layout';
import { modalPreviewModule } from '../plugins/basic-modal';
import { motionPreviewModule } from '../plugins/basic-motion';
import { radiusPreviewModule } from '../plugins/basic-radius';
import { sandboxPreviewModule } from '../plugins/basic-sandbox';
import { shadowPreviewModule } from '../plugins/basic-shadow';
import { spacingPreviewModule } from '../plugins/basic-spacing';
import { styleguidePreviewModule } from '../plugins/basic-styleguide';
import { surfacePreviewModule } from '../plugins/basic-surface';
import { tablePreviewModule } from '../plugins/basic-table';
import { typographyPreviewModule } from '../plugins/basic-typography';
import { dashboardPreviewModule } from '../plugins/dashboard';

export type PreviewModule = {
  id: string;
  title: string;
  render: (config: ThemeConfig) => string;
};

export const previewModules: PreviewModule[] = [
  dashboardPreviewModule,
  styleguidePreviewModule,
  sandboxPreviewModule,
  layoutPreviewModule,
  typographyPreviewModule,
  colorsPreviewModule,
  spacingPreviewModule,
  radiusPreviewModule,
  shadowPreviewModule,
  elevationPreviewModule,
  iconsPreviewModule,
  alertPreviewModule,
  tablePreviewModule,
  buttonsPreviewModule,
  inputsPreviewModule,
  cardPreviewModule,
  modalPreviewModule,
  motionPreviewModule,
  surfacePreviewModule,
];

import type { ThemeConfig } from '../compiler/types';
import { alertPreviewModule } from '../plugins/basic-alert';
import { buttonsPreviewModule } from '../plugins/basic-buttons';
import { cardPreviewModule } from '../plugins/basic-card';
import { colorsPreviewModule } from '../plugins/basic-colors';
import { inputsPreviewModule } from '../plugins/basic-inputs';
import { layoutPreviewModule } from '../plugins/basic-layout';
import { modalPreviewModule } from '../plugins/basic-modal';
import { radiusPreviewModule } from '../plugins/basic-radius';
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
  description?: string;
  render: (config: ThemeConfig) => string;
};

export const previewModules = [
  styleguidePreviewModule,
  layoutPreviewModule,
  dashboardPreviewModule,
  colorsPreviewModule,
  buttonsPreviewModule,
  inputsPreviewModule,
  cardPreviewModule,
  surfacePreviewModule,
  radiusPreviewModule,
  spacingPreviewModule,
  shadowPreviewModule,
  alertPreviewModule,
  tablePreviewModule,
  typographyPreviewModule,
  modalPreviewModule,
] satisfies PreviewModule[];

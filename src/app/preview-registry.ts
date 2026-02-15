export type PreviewModule = {
  id: string;
  title: string;
  description?: string;
  render: () => string;
};

import { alertPreviewModule } from '../plugins/basic-alert';
import { buttonsPreviewModule } from '../plugins/basic-buttons';
import { cardPreviewModule } from '../plugins/basic-card';
import { inputsPreviewModule } from '../plugins/basic-inputs';
import { modalPreviewModule } from '../plugins/basic-modal';
import { radiusPreviewModule } from '../plugins/basic-radius';
import { shadowPreviewModule } from '../plugins/basic-shadow';
import { surfacePreviewModule } from '../plugins/basic-surface';
import { tablePreviewModule } from '../plugins/basic-table';
import { dashboardPreviewModule } from '../plugins/dashboard';

export const previewModules = [
  dashboardPreviewModule,
  buttonsPreviewModule,
  inputsPreviewModule,
  cardPreviewModule,
  surfacePreviewModule,
  radiusPreviewModule,
  shadowPreviewModule,
  alertPreviewModule,
  tablePreviewModule,
  modalPreviewModule,
] satisfies PreviewModule[];

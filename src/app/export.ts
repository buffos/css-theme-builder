import { zipSync, type Zippable } from 'fflate';

import { compile } from '../compiler/compile';

import { getConfig } from './state';

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const downloadJson = () => {
  const config = getConfig();
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'theme.config.json');
};

export const downloadCssBundle = () => {
  const config = getConfig();
  const files = compile(config);
  const payload: Record<string, Uint8Array> = Object.entries(files).reduce(
    (acc, [name, content]) => {
      acc[name] = new TextEncoder().encode(content);
      return acc;
    },
    {} as Record<string, Uint8Array>
  );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const zipped = zipSync(payload as Zippable) as Uint8Array; // turns map to zip file
  const arrayBuffer = zipped.buffer.slice(0, zipped.byteLength) as ArrayBuffer;
  const blob = new Blob([arrayBuffer], { type: 'application/zip' });
  downloadBlob(blob, 'css-bundle.zip');
};

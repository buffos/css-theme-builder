import { zipSync as fflateZipSync, type Zippable } from 'fflate';

import { compile } from '../compiler/compile';
import type { ThemeConfig } from '../compiler/types';

import { getConfig, setConfig } from './state';

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
  const payload: Record<string, Uint8Array> = {};
  Object.entries(files).forEach(([name, content]) => {
    payload[name] = new TextEncoder().encode(content);
  });
  // Re-cast the function itself to a known signature
  // This satisfies both no-unsafe-call and no-unsafe-assignment
  const zipFn = fflateZipSync as (data: Zippable) => Uint8Array;
  const zipped = zipFn(payload);

  // Use the buffer to solve the BlobPart/SharedArrayBuffer mismatch

  const blob = new Blob([zipped as unknown as BlobPart], { type: 'application/zip' });
  downloadBlob(blob, 'css-bundle.zip');
};

export const loadConfigFromFile = async (file: File): Promise<void> => {
  const text = await file.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid theme config');
  }

  const candidate = parsed as Partial<ThemeConfig>;

  if (
    typeof candidate.name !== 'string' ||
    !candidate.colors ||
    typeof candidate.colors !== 'object'
  ) {
    throw new Error('Missing required fields (name, colors)');
  }

  setConfig(candidate as ThemeConfig);
};

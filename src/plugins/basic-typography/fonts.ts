export const GOOGLE_FONTS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Lato',
  'Poppins',
  'Source Sans Pro',
  'Raleway',
  'Noto Sans',
  'Ubuntu',
  'Playfair Display',
  'Merriweather',
  'Roboto Slab',
  'Lora',
  'Oswald',
  'PT Sans',
  'PT Serif',
  'Nunito',
  'Quicksand',
  'Fira Code',
  'JetBrains Mono',
];

export const isGoogleFont = (fontName: string) => {
  const cleanName = fontName.split(',')[0].replaceAll(/['"]/g, '').trim();
  return GOOGLE_FONTS.includes(cleanName);
};

export const getGoogleFontImport = (fontName: string) => {
  const cleanName = fontName.split(',')[0].replaceAll(/['"]/g, '').trim();
  const urlName = cleanName.replaceAll(/\s+/g, '+');
  return `@import url('https://fonts.googleapis.com/css2?family=${urlName}:wght@400;500;600;700&display=swap');`;
};

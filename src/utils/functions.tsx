export function delay(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function capitalize(text: string): string {
  const [firstLetter, ...otherLetters] = text?.split('') || ['', ''];

  return firstLetter?.toUpperCase() + otherLetters.join('')?.toLowerCase();
}

export function ensureHttpInUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://'))
    return url;

  return 'https://invalidhttpsimageendpoint.pspsps';
}

export function extractMimetype(url: string): string {
  if (url.includes('.png'))
    return 'image/png';

  if (url.includes('.gif'))
    return 'image/gif';

  if (url.includes('.jpeg'))
    return 'image/jpeg';

  return 'image/jpg';
}

export function scaleToScale(value: number, oldMin: number, oldMax: number, newMin: number, newMax: number): number {
  return (((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;
}

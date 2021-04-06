export function windowOpen(url: string, target: string = '_blank', features: string = 'noopener noreferrer'): void {
  if (!url.startsWith('https://') && !url.startsWith('http://'))
    url = `https://${url}`;

  window.open(url, target, features);
}

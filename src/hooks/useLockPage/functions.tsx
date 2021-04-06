export function getQueryParamsHashTable<T = Record<string, string>>(searchParams: string): T {
  return searchParams.slice(1)
    .split('&')
    .reduce((acc, fragment) => {
      const [key, value] = fragment.split('=')

      acc[key] = decodeURIComponent(value);

      return acc;
    }, { } as T);
}

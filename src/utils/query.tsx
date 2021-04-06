export function getErrorMessage(error: Error | { message: string | string[] }, fallbackMessage: string = 'Desculpe, ocorreu um erro inesperado.'): string {
  if (!error.hasOwnProperty('message'))
    return fallbackMessage;

  if (Array.isArray(error?.message))
    return error.message[0] || fallbackMessage;

  return error?.message || fallbackMessage;
}

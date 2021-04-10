import * as baseAxios from 'axios';
import { CancelToken } from 'axios';

const axios = baseAxios.default.create({
  timeout: 10 * 1_000,
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Promise<T> {
    cancel?: () => void;
  }
}

export function cancellableRequest<T>(
  factoryPromise: (cancelToken: CancelToken) => Promise<T> & { cancel?: () => void },
): Promise<T> & { cancel?: () => void } {
  const source = baseAxios.default.CancelToken.source();
  const promise = factoryPromise(source.token);

  promise.cancel = () => {
    console.log('Cancelado...');

    source.cancel('The operation was not completed, the requisition was canceled.');
  };

  return promise;
}

export default axios;

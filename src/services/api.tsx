import * as baseAxios from 'axios';
import { CancelToken } from 'axios';

import { environment } from '../environments/environment';
import useAuthStore from '../store/useAuth';

const axios = baseAxios.default.create({
  baseURL: environment.api.baseUrl,
  timeout: 10 * 1_000,
});

axios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().jwt?.token;

  if (!token) return config;

  config.headers.common['Authorization'] = token;

  return config;
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

    source.cancel('A operação não foi concluída, a requisição foi cancelada.');
  };

  return promise;
}

export default axios;
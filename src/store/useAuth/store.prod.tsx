import create, { UseStore } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { environment } from '../../environments/environment';
import { getStoreName } from '../utils/functions';
import useAuthStore from './index';
import { UseAuthStore } from './models';
import { getInfoAboutCurrentUserFromAPI, getTokenProxyFromAPI, resetState } from './services';
import { getCancelToken } from '../../utils/axios';
import { createErrorNotification } from '../../services/notification';

export function createAuthStore(): UseStore<UseAuthStore> {
  return create<UseAuthStore>(devtools(persist((set, get) => ({
    isLogged: null,
    jwt: null,
    user: null,
    getTokenProxyFromAPI: getTokenProxyFromAPI(set),
    getInfoAboutCurrentUserFromAPI: getInfoAboutCurrentUserFromAPI(set),
    resetState: resetState(set),
  }), {
    name: getStoreName('authStore'),
    version: environment.zustandStoreVersion,
    onRehydrateStorage: () => {
      return (state) => {
        useAuthStore.setState({ isLogged: state?.isLogged || false });

        if (!state.isLogged)
          return;

        useAuthStore.getState().getInfoAboutCurrentUserFromAPI(getCancelToken().token)
          .catch(error => createErrorNotification(error.message || 'Ocorreu um erro ao sincronizar as informações do usuário.'));
      };
    },
  }), 'useAuthStore'));
}

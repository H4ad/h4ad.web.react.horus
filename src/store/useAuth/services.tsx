import { CancelToken } from 'axios';
import { SetState } from 'zustand';
import { defaultQueryClient } from '../../App';

import { environment } from '../../environments/environment';
import { LoginPayload } from '../../models/payloads/login.payload';
import { TokenProxy } from '../../models/proxies/token.proxy';
import { UserProxy } from '../../models/proxies/user.proxy';
import api from '../../services/api';
import { UseAuthStore } from './models';

export function getTokenProxyFromAPI(set: SetState<UseAuthStore>): UseAuthStore['getTokenProxyFromAPI'] {
  return async function (cancelToken: CancelToken, authPath: string, payload: LoginPayload) {
    try {
      const url = environment.api.auth.local.replace('{authType}', authPath);
      const { data: jwt } = await api.post<TokenProxy>(url, payload, { cancelToken });

      set({ jwt });
    } catch (error) {
      if (error.__CANCEL__)
        return;

      throw new Error(error.response?.data?.message || 'Seu e-mail ou senha não estão corretos.');
    }
  };
}

export function getInfoAboutCurrentUserFromAPI(
  set: SetState<UseAuthStore>,
): UseAuthStore['getInfoAboutCurrentUserFromAPI'] {
  return async function (cancelToken) {
    try {
      const { data: user } = await api.get<UserProxy>(environment.api.user.me, { cancelToken });

      set({ user, isLogged: true });
    } catch (error) {
      resetState(set)();

      if (error.__CANCEL__)
        return;

      throw new Error(error.response?.data?.message || 'Não foi possível obter as informações do seu usuário, por favor, tente novamente.');
    }
  };
}

export function resetState(set: SetState<UseAuthStore>): () => void {
  return function () {
    defaultQueryClient.clear();

    set({
      isLogged: false,
      jwt: null,
      user: null,
    });
  };
}

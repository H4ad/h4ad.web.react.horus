import create, { UseStore } from 'zustand';
import { devtools } from 'zustand/middleware';

import { UserProxy } from '../../models/proxies/user.proxy';
import { UseAuthStore } from './models';
import { getStoreName } from '../utils/functions';

const user: UserProxy = {
  id: 1,
  email: 'vinicius.cardoso@facens.br',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isActive: true,
};

const jwt = {
  expiresAt: (new Date(+new Date() + 1000 * 60 * 60 * 24)).toISOString(),
  token: 'Bearer ...',
};

export function createAuthStore(): UseStore<UseAuthStore> {
  return create<UseAuthStore>(devtools((_) => ({
    isLogged: true,
    jwt,
    user,
    getTokenProxyFromAPI: () => Promise.resolve(),
    getInfoAboutCurrentUserFromAPI: () => Promise.resolve(),
    resetState: () => Promise.resolve(),
  }), getStoreName('useAuthStore')));
}

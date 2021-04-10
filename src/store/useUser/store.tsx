import create, { UseStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getStoreName } from '../utils/functions';
import { UseUserStore } from './models';
import { fetchUsersByIds, hydrateUsersFromStorage, saveUsersOnStorage, updateUserById } from './services';

export function createUseUserStore(): UseStore<UseUserStore> {
  const name = getStoreName('useUserStore');

  return create(
    devtools(
      (set, get) => {
        return {
          hydrated: false,
          usersMap: {},
          users: [],
          hydrateUsersFromStorage: hydrateUsersFromStorage(set, get),
          saveUsersOnStorage: saveUsersOnStorage(set, get),
          fetchUsersByIds: fetchUsersByIds(set, get),
          updateUserById: updateUserById(set, get),
        };
      },
      name,
    ),
  );
}

import { GetState, SetState } from 'zustand';
import { MondayClientSdk } from '../../@types/monday-sdk-js';
import { MondayStorageEnum } from '../../models/proxies/monday';
import { UserProxy } from '../../models/proxies/user.proxy';
import { getUserInfoByIds } from '../../services/monday';
import useMondayStore from '../useMonday';
import { UseUserStore } from './models';

export function updateUserById(set: SetState<UseUserStore>, get: GetState<UseUserStore>): UseUserStore['updateUserById'] {
  return function (userId, data) {
    const usersMap = get().usersMap;

    const updatedUsersMap = {
      ...usersMap,
      [userId]: {
        ...usersMap[userId],
        ...data,
      },
    };

    const updatedUsers = Object.values(updatedUsersMap);

    set({ users: updatedUsers, usersMap: updatedUsersMap });

    const monday = useMondayStore.getState().monday;

    if (!monday)
      return;

    get().saveUsersOnStorage(monday);
  }
}

export function fetchUsersByIds(set: SetState<UseUserStore>, get: GetState<UseUserStore>): UseUserStore['fetchUsersByIds'] {
  return async function (userIds) {
    const monday = useMondayStore.getState().monday;

    if (!monday)
      return Promise.resolve([]);

    const hydrated = get().hydrated;

    if (!hydrated)
      await get().hydrateUsersFromStorage(monday);

    return await getUserInfoByIds(monday, userIds)
      .then(users => {
        const updatedUsersMap = {};
        const usersMap = get().usersMap;

        for (const user of users) {
          updatedUsersMap[user.id] = {
            workTime: 7,
            ...user,
            ...usersMap[user.id],
          }
        }

        const updatedUsers = Object.values(usersMap);

        set({ users: updatedUsers, usersMap: updatedUsersMap });

        get().saveUsersOnStorage(monday);

        return users;
      })
  }
}

export function saveUsersOnStorage(set: SetState<UseUserStore>, get: GetState<UseUserStore>): UseUserStore['saveUsersOnStorage'] {
  return function (monday: MondayClientSdk) {
    const usersMap = get().usersMap;

    return monday.storage.instance.setItem(MondayStorageEnum.CACHED_USERS, JSON.stringify(usersMap))
      .then(result => {
        if (result.success) {
          monday.execute('notice', { type: 'success', message: 'User info updated with successful.' }).catch(console.error);
        } else {
          monday.execute('notice', { type: 'error', message: 'An error occur, user info cannot be saved.' }).catch(console.error);
        }

        return result.success;
      })
      .catch(error => {
        console.error(error);

        return false;
      });
  }
}

export function hydrateUsersFromStorage(set: SetState<UseUserStore>, get: GetState<UseUserStore>): UseUserStore['saveUsersOnStorage'] {
  return function (monday) {
    return monday.storage.instance.getItem(MondayStorageEnum.CACHED_USERS)
      .then(result => {
        if (!result || !result.value)
          return true;

        try {
          const updatedUsersMap: Record<number, UserProxy> = JSON.parse(result.value);

          const updatedUsers = Object.values(updatedUsersMap);

          set({ users: updatedUsers, usersMap: updatedUsersMap });
        } catch (e) {
          monday.execute('notice', { type: 'error', message: 'An error occur, we cannot get user info from cache.' }).catch(console.error);
        }

        return true;
      })
      .catch(error => {
        console.error(error);

        return false;
      });
  }
}

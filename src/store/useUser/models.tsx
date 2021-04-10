import { MondayClientSdk } from '../../@types/monday-sdk-js';
import { MondayUser } from '../../models/proxies/monday';
import { UserProxy } from '../../models/proxies/user.proxy';

export type UseUserStore = {
  hydrated: boolean;
  usersMap: Record<number, UserProxy>;
  users: UserProxy[];

  hydrateUsersFromStorage: (monday: MondayClientSdk) => Promise<boolean>;
  saveUsersOnStorage: (monday: MondayClientSdk) => Promise<boolean>;
  fetchUsersByIds: (userIds: number[]) => Promise<MondayUser[]>;
  updateUserById: (userId: number, data: Partial<Omit<UserProxy, 'id'>>) => void;
}

import { CancelToken } from 'axios';
import { CreateUserPayload } from '../../models/payloads/create-user.payload';
import { LoginPayload } from '../../models/payloads/login.payload';
import { TokenProxy } from '../../models/proxies/token.proxy';
import { UserProxy } from '../../models/proxies/user.proxy';

export type UseAuthStore = {
  isLogged: boolean | null;
  jwt: TokenProxy | null;
  user: UserProxy | null;

  getTokenProxyFromAPI: (cancelToken: CancelToken, payload: LoginPayload) => Promise<void>;
  getInfoAboutCurrentUserFromAPI: (cancelToken: CancelToken) => Promise<void>;
  createUserFromAPI: (cancelToken: CancelToken, payload: CreateUserPayload) => Promise<UserProxy | undefined>;
  resetState: () => void;
};
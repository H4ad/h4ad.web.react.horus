import { UserProxy } from '../../../../models/proxies/user.proxy';

export function getLevelByHourAndUser(count: number, user: UserProxy): number {
  if (count === 0) {
    return 0;
  }

  if (count < user.workTime) {
    return 1;
  }

  if (count > (user.workTime + 2)) {
    return 4;
  }

  if (count > (user.workTime + 1)) {
    return 3;
  }

  return 2;
}

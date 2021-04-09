import { environment } from '../environments/environment';
import { BoardStatisticQuery } from '../models/proxies/board-statistics.query';
import { MondayQueryAPI, MondayUser } from '../models/proxies/monday';
import { UseMondayStore } from '../store/useMonday';

export function getBoardsInfoForBoardStatistic(monday: any, boardIds: number[], settings: UseMondayStore['settings']): MondayQueryAPI<BoardStatisticQuery>  {
  if (!settings.timeTrackingColumnId || !settings.personColumnId)
    return null;

  if (!monday)
    return null;

  const query = environment.graphql.getBoardsInfoForBoardStatistic
    .replace('{boardIds}', boardIds.join(','))
    .replace('{columnValueIds}', JSON.stringify([settings.timeTrackingColumnId, settings.personColumnId]));

  return monday.api(query);
}

export function getUserInfoByIds(monday: any, userIds: number[]): MondayUser[]  {
  if (!monday)
    return null;

  const query = environment.graphql.getUsersByIds
    .replace('{userIds}', JSON.stringify(userIds));

  return monday.api(query).then(result => result.data.users);
}

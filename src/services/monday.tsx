import { MondayClientSdk } from '../@types/monday-sdk-js';
import { environment } from '../environments/environment';
import { BoardStatisticQuery } from '../models/proxies/board-statistics.query';
import { MondayQueryAPI, MondayUser } from '../models/proxies/monday';
import { UseMondayStore } from '../store/useMonday';
import { getColumnsStoreInList } from '../store/useMonday/functions';

export async function getBoardsInfoForBoardStatistic(monday: MondayClientSdk, boardIds: number[], settings: UseMondayStore['settings']): Promise<MondayQueryAPI<BoardStatisticQuery>> {
  if (environment.useMockedData)
    return import('../components/UserCalendar/examples/ermes.json').then(result => ({ data: result.data, account_id: result.account_id }));

  const timeTrackingColumns = getColumnsStoreInList(settings.timeTrackingColumnId);
  const personColumns = getColumnsStoreInList(settings.personColumnId);

  if (!monday)
    return { data: { boards: [] }, account_id: 0 };

  const query = environment.graphql.getBoardsInfoForBoardStatistic
    .replace('{boardIds}', boardIds.join(','))
    .replace('{columnValueIds}', JSON.stringify([...timeTrackingColumns, ...personColumns, 'time_tracking', 'people', 'person', 'recurso', 'controle_de_tempo'].flat(2)));

  return monday.api(query);
}

export async function getUserInfoByIds(monday: MondayClientSdk, userIds: number[]): Promise<MondayUser[]> {
  if (environment.useMockedData)
    return import('../components/UserCalendar/examples/users.json').then(result => [...result?.data?.users]);

  if (!monday)
    return null;

  const query = environment.graphql.getUsersByIds
    .replace('{userIds}', JSON.stringify(userIds));

  return monday.api<MondayQueryAPI<{ users: MondayUser[] }>>(query).then(result => result.data.users);
}

import { GetState, SetState } from 'zustand';
import { CalendarDataContributionItem } from '../../components/UserCalendar/services/contributions';
import { getCalendarDataFromMondayQuery } from '../../pages/BoardStatistic/Reports/functions';
import { getBoardsInfoForBoardStatistic } from '../../services/monday';
import useUserStore from '../useUser';
import { UseMondayStore } from './models';

export function onChangeSelectedDays(set: SetState<UseMondayStore>, get: GetState<UseMondayStore>): UseMondayStore['onChangeSelectedDay'] {
  return function(user, newData) {
    const oldValues = get().selectedDays;

    const newSelectedDaysMap: Record<string, Record<string, CalendarDataContributionItem>> = {};
    const newDays = Object.keys(newData);

    for (const day of newDays) {
      const oldDay = oldValues[day];
      const newDay = newData[day];

      newSelectedDaysMap[day] = {
        ...oldDay,
        [user.id]: newDay,
      };
    }

    const oldDays = Object.keys(oldValues);

    for (const day of oldDays) {
      const userIds = Object.keys(oldValues[day]).filter(userId => +userId !== user.id);

      if (userIds.length === 0)
        continue;

      newSelectedDaysMap[day] = newSelectedDaysMap[day] || {};

      for (const userId of userIds) {
        newSelectedDaysMap[day][userId] = oldValues[day][userId];
      }
    }

    set({ selectedDays: newSelectedDaysMap });
  }
}

export function fetchBoardItems (set: SetState<UseMondayStore>, get: GetState<UseMondayStore>): UseMondayStore['fetchBoardItems'] {
  return async function() {
    const monday = get().monday;
    const boardIds = get().boardIds;
    const settings = get().settings;

    set({ isLoadingData: true });

    try {
      const result = await getBoardsInfoForBoardStatistic(monday, boardIds, settings);
      const [userIds, calendars] = getCalendarDataFromMondayQuery(result, settings);

      set({ userIds, calendars });

      await useUserStore.getState().fetchUsersByIds(userIds);
    } catch (e) {
      await monday.execute('notice', { type: 'error', message: 'An error occur when trying getting board data, please, refresh the page.' });
    } finally {
      set({ isLoadingData: false });
    }
  }
}

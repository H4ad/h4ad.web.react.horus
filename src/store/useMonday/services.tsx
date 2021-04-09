import { GetState, SetState } from 'zustand';
import { CalendarDataContributionItem } from '../../components/UserCalendar/services/contributions';
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

    const oldDays = Object.keys(oldValues).filter(day => !newData[day]?.items);

    for (const day of oldDays) {
      const userIds = Object.keys(oldValues[day]).filter(userId => +userId !== user.id);

      newSelectedDaysMap[day] = newSelectedDaysMap[day] || {};

      for (const userId of userIds) {
        newSelectedDaysMap[day][userId] = oldValues[day][userId];
      }
    }

    set({ selectedDays: newSelectedDaysMap });
  }
}

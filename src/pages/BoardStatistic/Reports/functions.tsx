import subYears from 'date-fns/subYears';
import { Dispatch } from 'react';
import { CalendarData, CalendarDataContributionItem, CalendarDataYears } from '../../../components/UserCalendar/services/contributions';
import { BoardStatisticQuery } from '../../../models/proxies/board-statistics.query';
import { MondayQueryAPI, MondayUser } from '../../../models/proxies/monday';
import { TaskItemProxy } from '../../../models/proxies/task-item.proxy';
import { UseMondayStore } from '../../../store/useMonday';
import { getTimeTrackingLogsFromItem, getUserIdsFromItem } from '../../../utils/monday';

export function getCalendarDataFromMondayQuery(query: MondayQueryAPI<BoardStatisticQuery>, settings: UseMondayStore['settings']): [number[], CalendarData[]] {
  if (!settings.timeTrackingColumnId && !settings.personColumnId)
    return [[], []];

  const userIdsToMap = {};

  const { boards } = query.data;

  const years: Record<number, CalendarDataYears> = {};
  const dedupedContributions: Record<number, Record<string, CalendarDataContributionItem>> = {};
  const tasks: Record<number, TaskItemProxy[]> = {};

  const lastYear = subYears(new Date(), 1);

  for (const board of boards) {
    for (const item of board.items) {
      const userIds = getUserIdsFromItem(item, settings.personColumnId);
      const timeTrackingLogs = getTimeTrackingLogsFromItem(item, settings.timeTrackingColumnId);

      for (const userId of userIds) {
        userIdsToMap[userId] = true;

        for (const log of timeTrackingLogs) {
          const task: TaskItemProxy = {
            boardId: +board.id,
            itemId: +item.id,
            itemName: item.name,
            userId,
            ...log,
          };

          const taskYear = new Date(task.startedAt).getFullYear();

          years[task.userId] = years[task.userId] || { lastYear: 0 };

          years[task.userId][taskYear] = years[task.userId][taskYear] || 0;
          years[task.userId][taskYear] += task.time;

          const taskDate = new Date(task.startedAt);

          if (taskDate > lastYear) {
            years[task.userId].lastYear = years[task.userId].lastYear || 0;
            years[task.userId].lastYear += task.time;
          }

          const date = task.startedAt.slice(0, 10);

          dedupedContributions[task.userId] = dedupedContributions[userId] || {};

          dedupedContributions[task.userId][date] = dedupedContributions[task.userId][date] || {
            date,
            count: 0,
            level: 3,
            items: [],
          };

          dedupedContributions[task.userId][date].count += task.time;

          if (!dedupedContributions[task.userId][date].items.some(item => item.id))
            dedupedContributions[task.userId][date].items.push(item);

          tasks[task.userId] = tasks[task.userId] || [];
          tasks[task.userId].push(task);
        }
      }
    }
  }

  const userIds = Object.keys(userIdsToMap).map(Number);

  const calendars = Object.keys(dedupedContributions).map(userId => {
    const yearsNumbers = Object.keys(years[+userId])
      .map(year => Number(year))
      .filter(year => !isNaN(year));

    return {
      userId: +userId,
      yearsNumbers,
      years: years[+userId],
      contributions: dedupedContributions[userId],
      tasks: tasks[+userId],
    }
  });

  return [userIds, calendars];
}

export function onChangeSelectedDays(user: MondayUser, days: Record<string, CalendarDataContributionItem>, oldValues: Record<string, Record<string, CalendarDataContributionItem>>, set: Dispatch<Record<string, Record<string, CalendarDataContributionItem>>>) {
  const newSelectedDaysMap: Record<string, Record<string, CalendarDataContributionItem>> = {};

  for (const day of Object.keys(days)) {
    const oldDay = oldValues[day];
    const newDay = days[day];

    if (newDay) {
      newSelectedDaysMap[day] = {
        ...oldDay,
        [user.id]: newDay,
      };
    } else {
      const userIds = Object.keys(oldDay[day]).filter(userId => +userId !== user.id);

      newSelectedDaysMap[day] = newSelectedDaysMap[day] || { };

      for (const userId of userIds) {
        newSelectedDaysMap[day][userId] = oldDay[day][userId];
      }
    }
  }

  set(newSelectedDaysMap);
}

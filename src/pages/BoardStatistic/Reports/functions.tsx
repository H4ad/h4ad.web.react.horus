import subYears from 'date-fns/subYears';
import { Dispatch } from 'react';
import xlsx from 'xlsx';
import { CalendarData, CalendarDataContributionItem, CalendarDataYears } from '../../../components/UserCalendar/services/contributions';
import { BoardStatisticQuery } from '../../../models/proxies/board-statistics.query';
import { MondayExportEnum, MondayQueryAPI, MondayUser } from '../../../models/proxies/monday';
import { TaskItemProxy } from '../../../models/proxies/task-item.proxy';
import { UserProxy } from '../../../models/proxies/user.proxy';
import { UseMondayStore } from '../../../store/useMonday';
import { getFormattedHours } from '../../../utils/hours';
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
            items: [],
          };

          dedupedContributions[task.userId][date].count += task.time;
          dedupedContributions[task.userId][date].items = [...dedupedContributions[task.userId][date].items, item];

          tasks[task.userId] = [...(tasks[task.userId] || []), task];
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

      newSelectedDaysMap[day] = newSelectedDaysMap[day] || {};

      for (const userId of userIds) {
        newSelectedDaysMap[day][userId] = oldDay[day][userId];
      }
    }
  }

  set(newSelectedDaysMap);
}

export function exportDataByType(type: MondayExportEnum, user: UserProxy[], calendarData: CalendarData[]): void {
  switch (type) {
    case MondayExportEnum.JSON:
      return exportDataByJson(user, calendarData);

    case MondayExportEnum.CSV:
      return exportDataByCSV(user, calendarData);

    case MondayExportEnum.EXCEL:
      return exportDataByExcel(user, calendarData);
  }
}

export function downloadObject(filename: string, object: any, type: string): void {
  const blob = new Blob([object], { type });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = href;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportDataByJson(users: UserProxy[], calendars: CalendarData[]): void {
  const filePrefix = users.length === 1 ? users[0].email : 'users';
  const fileName = `${filePrefix}_${new Date().toISOString()}.json`;

  const rows = [];

  for (let i = 0; i < users.length; i++) {
    rows.push({
      user: users[i],
      ...calendars[i],
    });
  }

  const json = JSON.stringify(rows);

  downloadObject(fileName, json, 'application/json');
}

export function exportDataByCSV(users: UserProxy[], calendars: CalendarData[]): void {
  const filePrefix = users.length === 1 ? users[0].email : 'users';
  const fileName = `${filePrefix}_${new Date().toISOString()}.csv`;

  let csv = 'Id,Name,Email,BoardId,ItemId,ItemName,Time,FormattedTime,StartedAt,EndedAt\n';

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    for (const task of calendars[i].tasks) {
      csv += `${user.id},`;
      csv += `"${user.name}",`;
      csv += `"${user.email}",`;
      csv += `${task.boardId},`;
      csv += `${task.itemId},`;
      csv += `"${task.itemName}",`;
      csv += `${task.time},`;
      csv += `${getFormattedHours(task.time)},`;
      csv += `${task.startedAt},`;
      csv += `${task.endedAt}`;
      csv += '\n';
    }
  }

  downloadObject(fileName, csv, 'text/csv');
}

export function exportDataByExcel(users: UserProxy[], calendars: CalendarData[]): void {
  const filePrefix = users.length === 1 ? users[0].email : 'users';
  const fileName = `${filePrefix}_${new Date().toISOString()}.xlsx`;

  const book = xlsx.utils.book_new();

  book.Props = {
    Title: 'Exported Hours',
    Subject: 'Exported Hours',
    CreatedDate: new Date(),
  };

  book.SheetNames = users.map(user => user.name);

  for (let i = 0; i < users.length; i++) {
    const rows: unknown[][] = [
      ['Id', 'Name', 'Email', 'Board Id', 'Item Id', 'Item Name', 'Time', 'Formatted Time', 'StartedAt', 'EndedAt']
    ];

    const user = users[i];

    for (const task of calendars[i].tasks) {
      rows.push([
        user.id, user.name, user.email, task.boardId, task.itemId, task.itemName, task.time, getFormattedHours(task.time), task.startedAt, task.endedAt,
      ]);
    }

    book.Sheets[user.name] = xlsx.utils.aoa_to_sheet(rows);
  }

  const bookToBinary = xlsx.write(book, { bookType: 'xlsx', type: 'binary' });

  const buf = new ArrayBuffer(bookToBinary.length); //convert s to arrayBuffer
  const view = new Uint8Array(buf);  //create uint8array as viewer

  for (let i = 0; i < bookToBinary.length; i++)
    view[i] = bookToBinary.charCodeAt(i) & 0xFF; //convert to octet

  downloadObject(fileName, view, 'application/octet-stream');
}

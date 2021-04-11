import { CalendarData } from '../components/UserCalendar/services/contributions';
import { MondayExportEnum } from '../models/proxies/monday';
import { UserProxy } from '../models/proxies/user.proxy';
import { getFormattedHours } from './hours';

export function exportDataByType(type: MondayExportEnum, user: UserProxy[], calendarData: CalendarData[]): void {
  switch (type) {
    case MondayExportEnum.JSON:
      return exportDataByJson(user, calendarData);

    case MondayExportEnum.CSV:
      return exportDataByCSV(user, calendarData);

    case MondayExportEnum.EXCEL:
      exportDataByExcel(user, calendarData);
      break;
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
    const tasks = calendars[i]?.tasks || [];

    for (const task of tasks) {
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

export async function exportDataByExcel(users: UserProxy[], calendars: CalendarData[]): Promise<void> {
  const filePrefix = users.length === 1 ? users[0].email : 'users';
  const fileName = `${filePrefix}_${new Date().toISOString()}.xlsx`;

  const xlsx = await import('xlsx/xlsx.mini');

  const book = xlsx.utils.book_new();

  book.Props = {
    Title: 'Exported Hours',
    Subject: 'Exported Hours',
    CreatedDate: new Date(),
  };

  book.SheetNames = users.map(user => user.name);

  for (let i = 0; i < users.length; i++) {
    const rows: unknown[][] = [
      ['Id', 'Name', 'Email', 'Board Id', 'Item Id', 'Item Name', 'Time', 'Formatted Time', 'StartedAt', 'EndedAt'],
    ];

    const user = users[i];
    const tasks = calendars[i]?.tasks || [];

    for (const task of tasks) {
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

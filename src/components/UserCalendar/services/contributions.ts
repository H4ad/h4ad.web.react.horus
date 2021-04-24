// Import modules separately to reduce bundle size
import addDays from 'date-fns/addDays';
import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import getMonth from 'date-fns/getMonth';
import isAfter from 'date-fns/isAfter';
import isSameYear from 'date-fns/isSameYear';
import parseISO from 'date-fns/parseISO';
import setDay from 'date-fns/setDay';
import subYears from 'date-fns/subYears';
import { MondayItem } from '../../../models/proxies/monday';
import { TaskItemProxy } from '../../../models/proxies/task-item.proxy';

const DATE_FORMAT = 'yyyy-MM-dd';

export type Block = {
  date: string;
  info?: CalendarDataContributionItem;
};

interface MonthLabel {
  x: number;
  label: string;
}

export interface GraphData {
  year: number;
  blocks: Array<Array<Block>>;
  monthLabels: Array<MonthLabel>;
  totalCount: number;
}

export interface RequestOptions {
  data: CalendarData;
  years: Array<number>;
  lastYear: boolean;
}

export type CalendarDataContributionItems = MondayItem & { boardId: string, task: TaskItemProxy };

export interface CalendarDataContributionItem {
  date: string;
  count: number;
  items: CalendarDataContributionItems[];
}

export interface CalendarDataYears {
  [year: number]: number;

  lastYear: number; // lastYear
}

export interface CalendarData {
  userId: number;
  yearsNumbers: number[];
  years: CalendarDataYears;
  contributions: Record<string, CalendarDataContributionItem>;
  tasks: TaskItemProxy[];
}

function getContributionsForDate(data: CalendarData, date: string) {
  return data.contributions[date];
}

function getBlocksForYear(year: number, data: CalendarData, lastYear: boolean) {
  const now = new Date();
  const firstDate = lastYear ? subYears(now, 1) : parseISO(`${year}-01-01`);
  const lastDate = lastYear ? now : parseISO(`${year}-12-31`);

  let weekStart = firstDate;

  // The week starts on Sunday - add days to get to next sunday if neccessary
  if (getDay(firstDate) !== 0) {
    weekStart = addDays(firstDate, getDay(firstDate));
  }

  // Fetch graph data for first row (Sundays)
  const firstRowDates = [];

  while (weekStart <= lastDate) {
    const date = format(weekStart, DATE_FORMAT);

    firstRowDates.push({
      date,
      info: getContributionsForDate(data, date),
    });

    weekStart = setDay(weekStart, 7);
  }

  // Add the remainig days per week (column for column)
  return firstRowDates.map(dateObj => {
    const dates = [];

    for (let i = 0; i <= 6; i += 1) {
      const date = format(setDay(parseISO(dateObj.date), i), DATE_FORMAT);

      if (isAfter(parseISO(date), lastDate)) {
        break;
      }

      dates.push({
        date,
        info: getContributionsForDate(data, date),
      });
    }

    return dates;
  });
}

function getMonthLabels(blocks: GraphData['blocks'], lastYear: boolean): Array<MonthLabel> {
  const weeks = blocks.slice(0, lastYear ? blocks.length - 1 : blocks.length);
  let previousMonth = 0; // January

  return weeks.reduce<Array<MonthLabel>>((labels, week, x) => {
    const firstWeekDay = parseISO(week[0].date);
    const month = getMonth(firstWeekDay) + 1;
    const monthChanged = month !== previousMonth;
    const firstMonthIsDecember = x === 0 && month === 12;

    if (monthChanged && !firstMonthIsDecember) {
      labels.push({
        x,
        label: format(firstWeekDay, 'MMM'),
      });

      previousMonth = month;
    }

    return labels;
  }, []);
}

function getGraphDataForYear(year: number, data: CalendarData, lastYear: boolean): GraphData {
  const blocks = getBlocksForYear(year, data, lastYear);
  const monthLabels = getMonthLabels(blocks, lastYear);
  const totalCount = data.years[lastYear ? 'lastYear' : year] ?? 0;

  return {
    year,
    blocks,
    monthLabels,
    totalCount,
  };
}

export async function getProcessGraphData(options: RequestOptions): Promise<Array<GraphData>> {
  const { years, lastYear, data } = options;

  if (!Object.keys(data.years).length) {
    throw Error('No data available');
  }

  return years.map(year => {
    const isCurrentYear = isSameYear(parseISO(String(year)), new Date());

    return getGraphDataForYear(year, data, isCurrentYear && lastYear);
  });
}

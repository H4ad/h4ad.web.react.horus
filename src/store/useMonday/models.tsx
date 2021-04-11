import { MondayClientSdk } from '../../@types/monday-sdk-js';
import { CalendarData, CalendarDataContributionItem } from '../../components/UserCalendar/services/contributions';
import { MondayUser } from '../../models/proxies/monday';

export type MondayListenEvent = {
  data: number[];
}

export type MondayColumn = {
  [key: string]: string[] | string;

  default?: string[];
};

export type MondayColumnStore = {
  [key: string]: string[];

  default?: string[];
};

export type MondaySettingsEvent = {
  data: {
    personColumn?: MondayColumn;
    timeTrackingColumn?: MondayColumn;
  };
}

export type MondayContextEvent = {
  data: {
    boardIds?: number[];
    boardId?: number;
  };
}

export type UseMondayStore = {
  monday: MondayClientSdk;
  itemIds: number[];
  settings?: {
    personColumnId?: MondayColumnStore;
    timeTrackingColumnId?: MondayColumnStore;
  };
  isLoadingData: boolean;
  boardIds: number[];
  userIds: number[];
  calendars: CalendarData[];

  fetchBoardItems: () => Promise<void>;
  selectedDays: Record<string, Record<string, CalendarDataContributionItem>>;
  onChangeSelectedDay: (user: MondayUser, newData: Record<string, CalendarDataContributionItem>) => void;

  openItemCard: (itemId: number) => void;
}

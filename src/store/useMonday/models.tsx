import { CalendarDataContributionItem } from '../../components/UserCalendar/services/contributions';
import { MondayUser } from '../../models/proxies/monday';

export type UseMondayStore = {
  monday: any;
  itemIds: number[];
  settings?: {
    personColumnId?: string;
    timeTrackingColumnId?: string;
  };
  boardIds: number[];

  selectedDays: Record<string, Record<string, CalendarDataContributionItem>>;
  onChangeSelectedDay: (user: MondayUser, newData: Record<string, CalendarDataContributionItem>) => void;

  openItemCard: (itemId: number) => void;
}

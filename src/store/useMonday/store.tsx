import mondaySdk from 'monday-sdk-js';
import create, { UseStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { MondayClientSdk } from '../../@types/monday-sdk-js';
import { environment } from '../../environments/environment';
import { getStoreName } from '../utils/functions';
import { MondayContextEvent, MondayListenEvent, MondaySettingsEvent, UseMondayStore } from './models';
import { fetchBoardItems, onChangeSelectedDays } from './services';

const monday: MondayClientSdk = mondaySdk()

export function createUseMondayStore(): UseStore<UseMondayStore> {
  const name = getStoreName('useMondayStore');

  return create(
    devtools(
      (set, get) => {
        monday.listen<MondayListenEvent>('itemIds', res => {
          console.log(res);

          set({ itemIds: res.data });
        });

        monday.listen<MondaySettingsEvent>('settings', res => {
          console.log(res);

          const { personColumn, timeTrackingColumn, ...settings } = res.data;

          set({
            settings: {
              ...settings,
              timeTrackingColumnId: Object.keys(timeTrackingColumn || {})[0],
              personColumnId: Object.keys(personColumn || {})[0],
            },
          });

          get().fetchBoardItems();
        });

        monday.listen<MondayContextEvent>('context', res => {
          set({ boardIds: res.data.boardIds || [res.data.boardId] });

          get().fetchBoardItems();
        });

        setTimeout(() => {
          if (environment.useMockedData)
            fetchBoardItems(set, get)();
        }, 1000);

        return {
          monday,
          isLoadingData: false,
          boardIds: environment.useMockedData ? [15] : [],
          itemIds: [],
          userIds: [],
          calendars: [],
          settings: {
            personColumnId: environment.useMockedData ? 'person' : '',
            timeTrackingColumnId: environment.useMockedData ? 'time_tracking' : '',
          },
          selectedDays: {},
          fetchBoardItems: fetchBoardItems(set, get),
          onChangeSelectedDay: onChangeSelectedDays(set, get),
          openItemCard: (itemId) => monday?.execute('openItemCard', { itemId, kind: 'columns' }),
        };
      },
      name,
    ),
  );
}

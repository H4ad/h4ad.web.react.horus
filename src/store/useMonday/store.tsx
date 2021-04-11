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
          set({ itemIds: res.data });
        });

        monday.listen<MondaySettingsEvent>('settings', res => {
          const { personColumn, timeTrackingColumn, ...settings } = res.data;

          if (!personColumn)
            return;

          if (!timeTrackingColumn)
            return;

          for (const key of Object.keys(personColumn)) {
            if (Array.isArray(personColumn[key]))
              continue;

            personColumn.default = [key];

            delete personColumn[key];
          }

          for (const key of Object.keys(timeTrackingColumn)) {
            if (Array.isArray(timeTrackingColumn[key]))
              continue;

            timeTrackingColumn.default = [key];

            delete timeTrackingColumn[key];
          }

          const { default: personDefault, ...personColumns } = personColumn;
          const { default: timeTrackingDefault, ...timeTrackingColumns } = timeTrackingColumn;

          set({
            settings: {
              ...settings,
              timeTrackingColumnId: { default: timeTrackingDefault, ...timeTrackingColumns },
              personColumnId: { default: personDefault, ...personColumns },
            },
          });

          get().fetchBoardItems();
        });

        monday.listen<MondayContextEvent>('context', res => {
          const boardIds = res.data.boardIds || [res.data.boardId];
          const oldBoardIds = get()?.boardIds || [];

          if (boardIds.every(boardId => oldBoardIds.includes(boardId)) && boardIds.length === oldBoardIds.length)
            return;

          set({ boardIds });

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
            personColumnId: {
              default: [environment.useMockedData ? 'person' : ''],
            },
            timeTrackingColumnId: {
              default: [environment.useMockedData ? 'time_tracking' : ''],
            },
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

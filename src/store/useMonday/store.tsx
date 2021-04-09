import mondaySdk from 'monday-sdk-js';
import create, { UseStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getStoreName } from '../utils/functions';
import { UseMondayStore } from './models';
import { onChangeSelectedDays } from './services';

const monday = mondaySdk()

export function createUseMondayStore(): UseStore<UseMondayStore> {
  const name = getStoreName('useMondayStore');

  return create(
    devtools(
      (set, get) => {
        monday.listen('itemIds', res => {
          console.log(res);

          set({ itemIds: res.data });
        });

        monday.listen('settings', res => {
          console.log(res);

          const { personColumn, timeTrackingColumn, ...settings } = res.data;

          set({
            settings: {
              ...settings,
              timeTrackingColumnId: Object.keys(timeTrackingColumn || {})[0],
              personColumnId: Object.keys(personColumn || {})[0],
            },
          });
        });

        monday.listen('context', res => {
          console.log(res);

          set({ boardIds: res.data.boardIds || [res.data.boardId] });
        });

        return {
          monday,
          boardIds: [],
          itemIds: [],
          settings: {
            personColumnId: 'person',
            timeTrackingColumnId: 'time_tracking',
          },
          selectedDays: {},
          onChangeSelectedDay: onChangeSelectedDays(set, get),
          openItemCard: (itemId) => monday?.execute('openItemCard', { itemId, kind: 'columns' })
        };
      },
      name,
    ),
  );
}

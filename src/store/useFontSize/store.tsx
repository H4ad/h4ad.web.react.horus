import create, { UseStore } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { environment } from '../../environments/environment';
import { getStoreName } from '../utils/functions';
import { UseFontSizeStore } from './models';
import { setFontSize } from './services';

export function createUseFontSizeStore(): UseStore<UseFontSizeStore> {
  const name = getStoreName('useFontSizeStore');

  return create(
    devtools(
      persist((set) => ({
        fontSize: 16,
        setFontSize: setFontSize(set),
      }), {
        name,
        version: environment.zustandStoreVersion,
        onRehydrateStorage: () => {
          return (state) => {
            state.setFontSize(state.fontSize);
          };
        },
      }),
      name,
    ),
  );
}

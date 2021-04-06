import { SetState } from 'zustand';
import { UseFontSizeStore } from './index';

export function setFontSize(set: SetState<UseFontSizeStore>): UseFontSizeStore['setFontSize'] {
  return async function (fontSize: number) {
    set({ fontSize });
  };
}

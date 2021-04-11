import { MondayColumnStore } from './models';

export function getColumnsStoreInList(column: MondayColumnStore): string[] {
  return Object.values(column).filter(col => !!col).flat(2);
}

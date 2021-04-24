import { TimeTrackingProxy } from './time-tracking.proxy';

export interface TaskItemProxy extends TimeTrackingProxy {
  boardId: number;
  itemId: number;
  userId: number;
  boardName: string;
  itemName: string;
}

import { MondayUser } from './monday';

export interface UserProxy extends MondayUser {
  workTime: number;
}

import { MondayBoard, MondayUser } from './monday';

export interface BoardStatisticQuery {
  boards: MondayBoard[];
}

export interface UsersQuery {
  users: MondayUser[];
}

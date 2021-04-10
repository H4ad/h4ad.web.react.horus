export interface MondayQueryAPI<T> {
  data: T;
  account_id: number;
}

export interface MondayBoard {
  id: string;
  items: MondayItem[];
}

export interface MondayItem {
  id: string;
  name: string;
  column_values: MondayColumnValue[];
}

export interface MondayUser {
  id: number;
  name: string;
  email: string;
  photo_thumb_small: string;
}

export interface MondayColumnValue {
  id: string;
  value: null | string;
}

export interface MondayTimeTracking {
  id: number;
  account_id: number;
  project_id: number;
  column_id: string;
  started_user_id: number;
  ended_user_id: number;
  started_at: string;
  ended_at: string;
  manually_entered_start_time: boolean;
  manually_entered_end_time: boolean;
  manually_entered_start_date: boolean;
  manually_entered_end_date: boolean;
  created_at: string;
  updated_at: string;
  status: string;
}

export enum MondayStorageEnum {
  CACHED_USERS = '@horus/cached_user',
}

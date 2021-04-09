import { MondayItem, MondayTimeTracking } from '../models/proxies/monday';
import { TimeTrackingProxy } from '../models/proxies/time-tracking.proxy';

export function getUserIdsFromItem(item: MondayItem, personColumnId: string): number[] {
  const columnValue = item.column_values.find(column => column.id === personColumnId);

  if (!columnValue)
    return [];

  const value = columnValue.value;

  if (!value)
    return [];

  try {
    const parsedValue = JSON.parse(value);

    if (!parsedValue)
      return [];

    if (!Array.isArray(parsedValue.personsAndTeams))
      return [];

    return parsedValue.personsAndTeams.map(person => person.id);
  } catch (e) {
    return [];
  }
}

export const TIME_TRACKING_MS_TO_HOUR_CONSTANT = 1000 * 60 * 60;

export function getTimeTrackingLogsFromItem(item: MondayItem, timeTrackingColumnId: string): TimeTrackingProxy[] {
  const columnValue = item.column_values.find(column => column.id === timeTrackingColumnId);

  if (!columnValue)
    return [];

  const value = columnValue.value;

  if (!value)
    return [];

  try {
    const parsedValue: { additional_value?: MondayTimeTracking[] } = JSON.parse(value);

    if (!parsedValue)
      return [];

    if (!Array.isArray(parsedValue.additional_value))
      return [];

    return parsedValue.additional_value
      .filter(timeTracking => !!timeTracking.started_at && !!timeTracking.ended_at)
      .map(timeTracking => {
        const rawTime = (+new Date(timeTracking.ended_at)) - (+new Date(timeTracking.started_at));

        return {
          time: rawTime / TIME_TRACKING_MS_TO_HOUR_CONSTANT,
          rawTime,
          startedAt: timeTracking.started_at,
          endedAt: timeTracking.ended_at,
        };
      });
  } catch (e) {
    return [];
  }
}

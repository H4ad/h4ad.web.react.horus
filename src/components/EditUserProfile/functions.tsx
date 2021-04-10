export function fromDateToHour(date: Date): number {
  return date.getHours() + date.getMinutes() / 60;
}

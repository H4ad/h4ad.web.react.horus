export function getFormattedHoursExtended(totalCount: number): string {
  const hours = ~~totalCount;
  const minutes = Math.round(60 * (totalCount % 1));

  return `${hours > 0 ? `${hours} hour${hours > 1 && 's' || ''} and ` : ''}${minutes > 0 && `${minutes} minute` || ''}${minutes > 1 && 's' || ''}`
}

export function getFormattedHours(totalCount: number): string {
  const hours = ~~totalCount;
  const minutes = Math.round(60 * (totalCount % 1));

  return `${hours < 10 && '0' || ''}${hours}:${minutes < 10 && '0' || ''}${minutes > 0 && `${minutes}` || ''}`
}

export function getFormattedRange(startedAt: string, endedAt: string): string {
  return `From ${new Date(startedAt).toLocaleTimeString()} to ${new Date(endedAt).toLocaleTimeString()}`
}

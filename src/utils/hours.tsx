export function getFormattedHoursExtended(totalCount: number): string {
  const hours = ~~totalCount;
  const minutes = Math.round(60 * (totalCount % 1));

  return `${hours} hour${hours > 1 && 's' || ''} ${minutes > 0 && `and ${minutes} minute` || ''}${minutes > 1 && 's' || ''}`
}

export function getFormattedHours(totalCount: number): string {
  const hours = ~~totalCount;
  const minutes = Math.round(60 * (totalCount % 1));

  return `${hours < 10 && '0' || ''}${hours}:${minutes < 10 && '0' || ''}${minutes > 0 && `${minutes}` || ''}`
}

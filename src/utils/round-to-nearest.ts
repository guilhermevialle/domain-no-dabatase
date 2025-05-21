export function roundToNearest(date: Date, value: number = 5): Date {
  const ms = date.getTime()
  const rounded = Math.round(ms / (value * 60 * 1000)) * (value * 60 * 1000)
  return new Date(rounded)
}

import { addYears, parseISO } from 'date-fns'

export function getFutureDate(date: string): Date {
  return addYears(parseISO(date), 1)
}

export interface TimeRange {
  start: string
  end: string
}

export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export type WeeklySchedule = Partial<Record<Weekday, TimeRange[]>>

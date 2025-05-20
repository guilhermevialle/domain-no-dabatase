export type AvailableService =
  | 'Beard Trim'
  | 'Clean Shave'
  | 'Fade Cut'
  | 'Classic Haircut'
  | 'Modern Haircut'
  | 'Hair Coloring'
  | 'Scalp Treatment'
  | 'Eyebrow Trim'
  | 'Kids Haircut'
  | 'Hair Washing'

export const AVAILABLE_SERVICES: AvailableService[] = [
  'Beard Trim',
  'Clean Shave',
  'Fade Cut',
  'Classic Haircut',
  'Modern Haircut',
  'Hair Coloring',
  'Scalp Treatment',
  'Eyebrow Trim',
  'Kids Haircut',
  'Hair Washing',
] as const

export const BASE_DURATIONS_IN_MINUTES: Record<AvailableService, number> = {
  'Beard Trim': 15,
  'Clean Shave': 20,
  'Fade Cut': 40,
  'Classic Haircut': 30,
  'Modern Haircut': 30,
  'Hair Coloring': 60,
  'Scalp Treatment': 45,
  'Eyebrow Trim': 10,
  'Kids Haircut': 25,
  'Hair Washing': 15,
}

export const BASE_PRICES_IN_CENTS: Record<AvailableService, number> = {
  'Beard Trim': 2000, // $20.00
  'Clean Shave': 2500, // $25.00
  'Fade Cut': 3000, // $30.00
  'Classic Haircut': 3000, // $30.00
  'Modern Haircut': 3500, // $35.00
  'Hair Coloring': 6000, // $60.00
  'Scalp Treatment': 4500, // $45.00
  'Eyebrow Trim': 1500, // $15.00
  'Kids Haircut': 2500, // $25.00
  'Hair Washing': 1500, // $15.00
}

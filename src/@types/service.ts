export type AvailableService =
  | 'Beard Trim'
  | 'Clean Shave'
  | 'Modern Haircut'
  | 'Kids Haircut'
  | 'Hair Washing';

export const AVAILABLE_SERVICES: AvailableService[] = [
  'Beard Trim',
  'Clean Shave',
  'Modern Haircut',
  'Kids Haircut',
  'Hair Washing',
] as const;

export const BASE_DURATIONS_IN_MINUTES: Record<AvailableService, number> = {
  'Beard Trim': 30,
  'Clean Shave': 30,
  'Modern Haircut': 30,
  'Kids Haircut': 30,
  'Hair Washing': 30,
};

export const BASE_PRICES_IN_CENTS: Record<AvailableService, number> = {
  'Beard Trim': 2000, // $20.00
  'Clean Shave': 2500, // $25.00
  'Modern Haircut': 3500, // $35.00
  'Kids Haircut': 2500, // $25.00
  'Hair Washing': 1500, // $15.00
};

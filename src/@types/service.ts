export const SERVICES = {
  beard_trim: 'Beard Trim',
  clean_shave: 'Clean Shave',
  fade_cut: 'Fade Cut',
  classic_haircut: 'Classic Haircut',
  modern_haircut: 'Modern Haircut',
  hair_coloring: 'Hair Coloring',
  scalp_treatment: 'Scalp Treatment',
  eyebrow_trim: 'Eyebrow Trim',
  kids_haircut: 'Kids Haircut',
  hair_washing: 'Hair Washing',
} as const

export const SERVICES_DURATION: Record<Service, number> = {
  'Beard Trim': 15,
  'Clean Shave': 20,
  'Fade Cut': 40,
  'Classic Haircut': 30,
  'Modern Haircut': 35,
  'Hair Coloring': 90,
  'Scalp Treatment': 25,
  'Eyebrow Trim': 10,
  'Kids Haircut': 25,
  'Hair Washing': 10,
}

export type Service = (typeof SERVICES)[keyof typeof SERVICES]

export const SERVICES_PRICE_IN_CENTS: Record<Service, number> = {
  'Beard Trim': 2500,
  'Clean Shave': 3000,
  'Fade Cut': 4500,
  'Classic Haircut': 3500,
  'Modern Haircut': 4000,
  'Hair Coloring': 9000,
  'Scalp Treatment': 3000,
  'Eyebrow Trim': 1500,
  'Kids Haircut': 3000,
  'Hair Washing': 1000,
}

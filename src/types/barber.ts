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

export type Service = (typeof SERVICES)[keyof typeof SERVICES]

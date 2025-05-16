import { Barber } from '../domain/entities/barber'

export const barbers: Barber[] = [
  new Barber({
    id: 'barber-1',
    fullName: 'James',
    since: new Date('2020-03-5'),
    services: [
      'Fade Cut',
      'Classic Haircut',
      'Modern Haircut',
      'Hair Washing',
      'Hair Coloring',
    ],
  }),
  new Barber({
    id: 'barber-2',
    fullName: 'Batista',
    since: new Date('1980-01-10'),
    services: ['Fade Cut', 'Modern Haircut', 'Clean Shave', 'Beard Trim'],
  }),
  new Barber({
    id: 'barber-3',
    fullName: 'Ryan',
    since: new Date('2010-07-23'),
    services: [
      'Beard Trim',
      'Clean Shave',
      'Kids Haircut',
      'Modern Haircut',
      'Fade Cut',
      'Eyebrow Trim',
      'Scalp Treatment',
    ],
  }),
]

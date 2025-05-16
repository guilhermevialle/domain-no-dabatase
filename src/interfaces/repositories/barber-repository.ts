import { Barber } from '../../domain/entities/barber'

export interface IBarberRepository {
  create: (barber: Barber) => Promise<void>
  findById: (id: string) => Promise<Barber | null>
}

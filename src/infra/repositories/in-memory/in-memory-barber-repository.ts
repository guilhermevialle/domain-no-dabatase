import { barbers } from '../../../constants/barbers'
import { Barber } from '../../../domain/entities/barber'
import { IBarberRepository } from '../../../interfaces/repositories/barber-repository'

export class InMemoryBarberRepository implements IBarberRepository {
  private items: Barber[] = barbers
}

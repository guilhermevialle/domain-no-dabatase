import { barbers } from '../../../constants/barbers'
import { Barber } from '../../../domain/entities/barber'
import { IBarberRepository } from '../../../interfaces/repositories/barber-repository'

export class InMemoryBarberRepository implements IBarberRepository {
  private items: Barber[] = barbers

  async create(barber: Barber): Promise<void> {
    this.items.push(barber)
  }

  async findById(id: string): Promise<Barber | null> {
    const barber = this.items.find((barber) => barber.id === id)

    return barber ?? null
  }
}

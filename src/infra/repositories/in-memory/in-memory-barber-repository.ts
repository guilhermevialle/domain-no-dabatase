import { Barber } from '../../../domain/entities/barber'
import { IBarberRepository } from '../../../interfaces/repositories/barber-repository'

export class InMemoryBarberRepository implements IBarberRepository {
  private storage: Barber[] = [
    new Barber({
      id: 'barber-1',
      since: new Date('2023-01-15'),
      fullName: 'John Doe',
      services: ['Beard Trim', 'Kids Haircut', 'Hair Washing'],
      bufferMinutes: 15,
    }),
  ]

  async create(barber: Barber): Promise<void> {
    this.storage.push(barber)
  }

  async update(barber: Barber): Promise<void> {
    const index = this.storage.findIndex((barber) => barber.id === barber.id)
    if (index === -1) throw new Error('Barber not found')
    this.storage[index] = barber
  }

  async findById(id: string): Promise<Barber | null> {
    const barber = this.storage.find((barber) => barber.id === id) ?? null
    return barber ?? null
  }
}

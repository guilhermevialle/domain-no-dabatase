import { Barber } from '@/domain/aggregates/barber';
import { IBarberRepository } from '@/interfaces/repositories/barber-repository.interface';

export class InMemoryBarberRepository implements IBarberRepository {
  private storage: Barber[] = [];

  async clear(): Promise<void> {
    this.storage = [];
  }

  async create(barber: Barber): Promise<void> {
    this.storage.push(barber);
  }

  async update(barber: Barber): Promise<void> {
    const index = this.storage.findIndex((barber) => barber.id === barber.id);
    this.storage[index] = barber;
  }

  async findById(id: string): Promise<Barber | null> {
    const barber = this.storage.find((barber) => barber.id === id) ?? null;
    return barber ?? null;
  }
}

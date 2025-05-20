import { AvailableDay } from '../../../domain/entities/available-day'
import { IAvailableDayRepository } from '../../../interfaces/repositories/available-day-repository'

export class InMemoryAvailableDayRepository implements IAvailableDayRepository {
  private storage: AvailableDay[] = [
    new AvailableDay({
      id: 'available-day-1',
      barberId: 'barber-1',
      weekday: 0,
    }),
    new AvailableDay({
      id: 'available-day-1',
      barberId: 'barber-1',
      weekday: 1,
    }),
    new AvailableDay({
      id: 'available-day-1',
      barberId: 'barber-1',
      weekday: 2,
    }),
    new AvailableDay({
      id: 'available-day-1',
      barberId: 'barber-1',
      weekday: 3,
    }),
    new AvailableDay({
      id: 'available-day-1',
      barberId: 'barber-1',
      weekday: 4,
    }),
    new AvailableDay({
      id: 'available-day-1',
      barberId: 'barber-1',
      weekday: 5,
    }),
  ]

  async create(day: AvailableDay): Promise<void> {
    this.storage.push(day)
  }

  async findManyByBarberId(barberId: string): Promise<AvailableDay[]> {
    return this.storage.filter((day) => day.barberId === barberId)
  }

  async findByWeekdayAndBarberId(
    barberId: string,
    weekday: number
  ): Promise<AvailableDay | null> {
    const availableDay = this.storage.find(
      (day) => day.barberId === barberId && day.weekday === weekday
    )

    return availableDay ?? null
  }
}

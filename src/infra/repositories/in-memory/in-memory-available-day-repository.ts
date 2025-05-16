import { AvailableDay } from '../../../domain/entities/available-day'

export class InMemoryAvailableDayRepository
  implements InMemoryAvailableDayRepository
{
  private items: AvailableDay[] = []

  async create(day: AvailableDay): Promise<void> {
    this.items.push(day)
  }

  async findByBarberIdAndWeekday(
    barberId: string,
    weekday: number
  ): Promise<AvailableDay | null> {
    return (
      this.items.find(
        (item) => item.barberId === barberId && item.weekday === weekday
      ) ?? null
    )
  }

  async findManyByBarberId(barberId: string): Promise<AvailableDay[]> {
    return this.items.filter((item) => item.barberId === barberId)
  }

  async list(): Promise<AvailableDay[]> {
    return this.items
  }
}

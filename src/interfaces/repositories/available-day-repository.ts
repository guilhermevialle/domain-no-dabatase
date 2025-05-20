import { AvailableDay } from '../../domain/entities/available-day'

export interface IAvailableDayRepository {
  create(day: AvailableDay): Promise<void>
  findManyByBarberId(barberId: string): Promise<AvailableDay[]>
}

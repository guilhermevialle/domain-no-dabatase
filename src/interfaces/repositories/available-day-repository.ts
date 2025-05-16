import { AvailableDay } from '../../domain/entities/available-day'

export interface AvailableDayRepository {
  findByBarberId: (id: string) => Promise<AvailableDay>
}

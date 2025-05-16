import { AvailableSlot } from '../../domain/entities/available-slot'

export interface IAvailableSlotRepository {
  findByAvailableDayId: (id: string) => Promise<AvailableSlot[]>
}

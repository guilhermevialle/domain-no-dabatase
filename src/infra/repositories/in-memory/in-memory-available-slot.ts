import { AvailableSlot } from '../../../domain/entities/available-slot'
import { IAvailableSlotRepository } from '../../../interfaces/repositories/available-slot-repository'

export class InMemoryAvailableSlotRepository
  implements IAvailableSlotRepository
{
  private items: AvailableSlot[] = []

  async create(slot: AvailableSlot): Promise<void> {
    this.items.push(slot)
  }

  async findByAvailableDayId(availableDayId: string): Promise<AvailableSlot[]> {
    return this.items.filter((item) => item.availableDayId === availableDayId)
  }

  async list(): Promise<AvailableSlot[]> {
    return this.items
  }
}

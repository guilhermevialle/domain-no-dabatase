import { TimeSlot } from '../../../domain/entities/time-slot';
import { ITimeSlotRepository } from '../../../interfaces/repositories/time-slot-repository';

export class InMemoryTimeSlotRepository implements ITimeSlotRepository {
  private storage: TimeSlot[] = [];

  async create(timeSlot: TimeSlot): Promise<void> {
    this.storage.push(timeSlot);
  }

  async createMany(timeSlots: TimeSlot[]): Promise<void> {
    this.storage.push(...timeSlots);
  }

  async findManyByAvailableDayId(id: string): Promise<TimeSlot[]> {
    return this.storage.filter((timeSlot) => timeSlot.availableDayId === id);
  }
}

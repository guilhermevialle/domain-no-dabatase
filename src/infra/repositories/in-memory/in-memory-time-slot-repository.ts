import { TimeSlot } from '../../../domain/entities/time-slot'
import { Time } from '../../../domain/value-objects/time'
import { ITimeSlotRepository } from '../../../interfaces/repositories/time-slot-repository'

export class InMemoryTimeSlotRepository implements ITimeSlotRepository {
  private storage: TimeSlot[] = [
    new TimeSlot({
      availableDayId: 'available-day-1',
      start: new Time('08:00'),
      end: new Time('12:00'),
    }),
    new TimeSlot({
      availableDayId: 'available-day-1',
      start: new Time('13:00'),
      end: new Time('17:30'),
    }),
  ]

  async create(timeSlot: TimeSlot): Promise<void> {
    this.storage.push(timeSlot)
  }

  async findManyByAvailableDayId(id: string): Promise<TimeSlot[]> {
    const slots = this.storage.filter(
      (timeSlot) => timeSlot.availableDayId === id
    )

    return slots
  }
}

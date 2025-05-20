import { TimeSlot } from '../../domain/entities/time-slot'

export interface ITimeSlotRepository {
  create: (timeSlot: TimeSlot) => Promise<void>
  findByAvailableDayId: (id: string) => Promise<TimeSlot[]>
}

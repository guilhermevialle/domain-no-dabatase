import { TimeSlot } from '../../domain/entities/time-slot';

export interface ITimeSlotRepository {
  create: (timeSlot: TimeSlot) => Promise<void>;
  createMany: (timeSlots: TimeSlot[]) => Promise<void>;
  findManyByAvailableDayId: (id: string) => Promise<TimeSlot[]>;
}

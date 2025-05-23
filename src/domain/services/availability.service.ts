import { isWithinInterval } from 'date-fns';
import { IAppointmentRepository } from '../../interfaces/repositories/appointment-repository';
import { IAvailableDayRepository } from '../../interfaces/repositories/available-day-repository';
import { IBarberRepository } from '../../interfaces/repositories/barber-repository';
import { ITimeSlotRepository } from '../../interfaces/repositories/time-slot-repository';
import { IAvailabilityService } from '../../interfaces/services/availability-service';

export class AvailabilityService implements IAvailabilityService {
  constructor(
    private appointmentRepo: IAppointmentRepository,
    private availableDayRepo: IAvailableDayRepository,
    private timeSlotRepo: ITimeSlotRepository,
    private barberRepo: IBarberRepository,
  ) {}

  async isBarberAvailable(barberId: string, startAt: Date): Promise<boolean> {
    const weekday = startAt.getDay();

    const availableDay = await this.availableDayRepo.findByWeekdayAndBarberId(
      barberId,
      weekday,
    );

    if (!availableDay) return false;

    const timeSlots = await this.timeSlotRepo.findManyByAvailableDayId(
      availableDay.id!,
    );

    const some = timeSlots.some((slot) =>
      isWithinInterval(startAt, {
        start: slot.start.toDate(startAt),
        end: slot.end.toDate(startAt),
      }),
    );

    if (some) return true;

    return false;
  }
}

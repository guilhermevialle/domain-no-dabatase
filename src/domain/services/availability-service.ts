import { addMinutes, isBefore, isWithinInterval } from 'date-fns';
import { IAppointmentRepository } from '../../interfaces/repositories/appointment-repository';
import { IAvailableDayRepository } from '../../interfaces/repositories/available-day-repository';
import { ITimeSlotRepository } from '../../interfaces/repositories/time-slot-repository';
import { IAvailabilityService } from '../../interfaces/services/availability-service';

export class AvailabilityService implements IAvailabilityService {
  constructor(
    private readonly availableDayRepo: IAvailableDayRepository,
    private readonly timeSlotRepo: ITimeSlotRepository,
    private readonly appointmentRepo: IAppointmentRepository,
  ) {}

  async isBarberAvailable(
    barberId: string,
    startAt: Date,
    ignoreAppointmentId?: string,
  ): Promise<boolean> {
    const now = new Date();

    if (isBefore(startAt, now)) return false;

    const weekday = startAt.getDay();

    const availableDay = await this.availableDayRepo.findByWeekdayAndBarberId(
      barberId,
      weekday,
    );

    if (!availableDay) return false;

    const slots = await this.timeSlotRepo.findManyByAvailableDayId(
      availableDay.id!,
    );

    const isOverlapping =
      await this.appointmentRepo.findOverlappingByDateAndBarberId(
        barberId,
        startAt,
        addMinutes(startAt, 30),
        ignoreAppointmentId,
      );

    if (isOverlapping) return false;

    return slots.some((slot) =>
      isWithinInterval(startAt, {
        start: slot.start.toDate(startAt),
        end: slot.end.toDate(startAt),
      }),
    );
  }
}

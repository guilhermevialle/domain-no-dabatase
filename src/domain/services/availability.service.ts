import { IAppointmentRepository } from '@/interfaces/repositories/appointment-repository.interface';
import { IBarberRepository } from '@/interfaces/repositories/barber-repository.interface';
import { IAvailabilityService } from '@/interfaces/services/availability-service';
import { addMinutes, isBefore, isWithinInterval } from 'date-fns';

export class AvailabilityService implements IAvailabilityService {
  constructor(
    private readonly barberRepo: IBarberRepository,
    private readonly appointmentRepo: IAppointmentRepository,
  ) {}

  async isWithinBarberShift(barberId: string, startAt: Date): Promise<boolean> {
    const barber = await this.barberRepo.findById(barberId);

    if (!barber) return false;

    const weekday = startAt.getDay();

    return barber.workDays.some(
      (workDay) =>
        workDay.weekday === weekday &&
        workDay.shifts.some((shift) =>
          isWithinInterval(startAt, {
            start: shift.start.toDate(startAt),
            end: shift.end.toDate(startAt),
          }),
        ),
    );
  }

  async isOverlappingByDateAndBarberId(
    barberId: string,
    startAt: Date,
    ignoreAppointmentId?: string,
  ): Promise<boolean> {
    const overlapping =
      await this.appointmentRepo.findOverlappingByDateAndBarberId(
        barberId,
        startAt,
        addMinutes(startAt, 30),
        ignoreAppointmentId,
      );

    return !!overlapping;
  }

  async isBarberAvailable(
    barberId: string,
    startAt: Date,
    ignoreAppointmentId?: string,
  ): Promise<boolean> {
    if (isBefore(startAt, new Date())) return false;

    const isWithinShift = await this.isWithinBarberShift(barberId, startAt);
    if (!isWithinShift) return false;

    const isOverlapping = await this.isOverlappingByDateAndBarberId(
      barberId,
      startAt,
      ignoreAppointmentId,
    );

    return !isOverlapping;
  }
}

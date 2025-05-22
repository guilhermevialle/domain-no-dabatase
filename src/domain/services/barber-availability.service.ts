import { IAppointmentRepository } from '../../interfaces/repositories/appointment-repository';
import { IAvailableDayRepository } from '../../interfaces/repositories/available-day-repository';
import { IBarberRepository } from '../../interfaces/repositories/barber-repository';
import { ITimeSlotRepository } from '../../interfaces/repositories/time-slot-repository';
import { IBarberAvailabilityService } from '../../interfaces/services/barber-availability-service';

export class BarberAvailabilityService implements IBarberAvailabilityService {
  constructor(
    private appointmentRepo: IAppointmentRepository,
    private availableDayRepo: IAvailableDayRepository,
    private timeSlotRepo: ITimeSlotRepository,
    private barberRepo: IBarberRepository,
  ) {}

  async isAvailable(
    barberId: string,
    startAt: Date,
    endAt: Date,
  ): Promise<boolean> {
    return await this.appointmentRepo.isOverlappingByDateAndBarberId(
      barberId,
      startAt,
      endAt,
    );
  }
}

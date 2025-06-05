import {
  AppointmentNotFoundError,
  BarberNotAvailableError,
} from '@/application/errors/shared';
import { Appointment } from '@/domain/entities/appointment';
import { IAppointmentRepository } from '@/interfaces/repositories/appointment-repository.interface';
import { IAvailabilityService } from '@/interfaces/services/availability-service';

interface RescheduleAppointmentRequest {
  id: string;
  startAt: Date;
}

type RescheduleAppointmentResponse = Appointment;

export class RescheduleAppointment {
  constructor(
    private appointmentRepo: IAppointmentRepository,
    private availability: IAvailabilityService,
  ) {}

  async execute({
    id,
    startAt,
  }: RescheduleAppointmentRequest): Promise<RescheduleAppointmentResponse> {
    const appointment = await this.appointmentRepo.findById(id);

    if (!appointment) throw new AppointmentNotFoundError();

    const isBarberAvailable = await this.availability.isBarberAvailable(
      appointment.barberId,
      startAt,
      id,
    );

    if (!isBarberAvailable) throw new BarberNotAvailableError();

    appointment.reschedule(startAt);

    await this.appointmentRepo.update(appointment);

    return appointment;
  }
}

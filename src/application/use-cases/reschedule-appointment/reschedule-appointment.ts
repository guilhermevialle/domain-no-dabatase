import { Appointment } from '../../../domain/entities/appointment';
import { IAppointmentRepository } from '../../../interfaces/repositories/appointment-repository';
import { IBarberAvailabilityService } from '../../../interfaces/services/barber-availability-service';

interface RescheduleAppointmentRequest {
  id: string;
  startAt: Date;
}

type RescheduleAppointmentResponse = Appointment;

export class RescheduleAppointment {
  constructor(
    private appointmentRepo: IAppointmentRepository,
    private barberAvailability: IBarberAvailabilityService,
  ) {}

  async execute({
    id,
    startAt,
  }: RescheduleAppointmentRequest): Promise<RescheduleAppointmentResponse> {
    const appointment = await this.appointmentRepo.findById(id);

    if (!appointment) throw new Error('Appointment not found.');

    appointment.reschedule(startAt);

    const isBarberAvailable = await this.barberAvailability.isBarberAvailable(
      appointment.barberId!,
      appointment.startAt,
      appointment.endAt,
    );

    if (!isBarberAvailable)
      throw new Error('Barber is not available at this time.');

    await this.appointmentRepo.update(appointment);

    return appointment;
  }
}

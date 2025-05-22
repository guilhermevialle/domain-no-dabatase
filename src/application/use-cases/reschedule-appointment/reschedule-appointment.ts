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
  }: RescheduleAppointmentRequest): Promise<RescheduleAppointmentResponse> {}
}

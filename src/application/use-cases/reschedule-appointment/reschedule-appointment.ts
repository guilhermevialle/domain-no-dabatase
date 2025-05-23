import { Appointment } from '../../../domain/entities/appointment';
import { IAppointmentRepository } from '../../../interfaces/repositories/appointment-repository';
import { IAvailabilityService } from '../../../interfaces/services/availability-service';
import { buildAppointment } from '../../../test/builders/build-entities';

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
    const appointment = buildAppointment({
      barberId: 'barber-1',
      customerId: 'customer-1',
    });

    await this.appointmentRepo.update(appointment);

    return appointment;
  }
}

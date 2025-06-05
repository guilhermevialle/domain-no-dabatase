import { Appointment } from '../../../domain/entities/appointment';
import { IAppointmentRepository } from '../../../interfaces/repositories/appointment-repository.interface';
import { AppointmentNotFoundError } from '../../errors/shared';

interface CancelAppointmentRequest {
  id: string;
}

type CancelAppointmentResponse = Appointment;

export class CancelAppointment {
  constructor(private appointmentRepo: IAppointmentRepository) {}

  async execute({
    id,
  }: CancelAppointmentRequest): Promise<CancelAppointmentResponse> {
    const appointment = await this.appointmentRepo.findById(id);

    if (!appointment) throw new AppointmentNotFoundError();

    appointment.cancel();

    await this.appointmentRepo.update(appointment);

    return appointment;
  }
}

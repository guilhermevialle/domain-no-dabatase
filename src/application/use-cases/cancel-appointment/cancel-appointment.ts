import { Appointment } from '../../../domain/entities/appointment'
import { IAppointmentRepository } from '../../../interfaces/repositories/appointment-repository'

interface CancelAppointmentRequest {
  appointmentId: string
}

type CancelAppointmentResponse = Appointment

export class CancelAppointment {
  constructor(private appointmentRepo: IAppointmentRepository) {}

  async execute({
    appointmentId,
  }: CancelAppointmentRequest): Promise<CancelAppointmentResponse> {
    const appointment = await this.appointmentRepo.findById(appointmentId)

    if (!appointment) throw new Error('Appointment not found.')

    if (appointment.status === 'CANCELED')
      throw new Error('Appointment is already canceled.')

    const canceledAppointment = appointment.cancel()

    await this.appointmentRepo.update(canceledAppointment)

    return canceledAppointment
  }
}

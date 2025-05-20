import { Appointment } from '../../../domain/entities/appointment'
import { IAppointmentRepository } from '../../../interfaces/repositories/appointment-repository'

interface CancelAppointmentRequest {
  id: string
}

type CancelAppointmentResponse = Appointment

export class CancelAppointment {
  constructor(private appointmentRepo: IAppointmentRepository) {}

  async execute({
    id,
  }: CancelAppointmentRequest): Promise<CancelAppointmentResponse> {
    const appointment = await this.appointmentRepo.findById(id)

    if (!appointment) throw new Error('Appointment not found.')
    if (appointment.status === 'CANCELED')
      throw new Error('Appointment already canceled.')

    appointment.cancel()

    await this.appointmentRepo.update(appointment)
    return appointment
  }
}

import { v4 } from 'uuid'
import { Appointment } from '../../../domain/entities/appointment'
import { IAppointmentRepository } from '../../../interfaces/repositories/appointment-repository'
import { Service } from '../../../types/barber'

interface CreateAppointmentRequest {
  customerId: string
  barberId: string
  service: Service
  startAt: Date
  endAt: Date
}
type CreateAppointmentResponse = Appointment

export class CreateAppointment {
  constructor(private appointmentRepo: IAppointmentRepository) {}

  async execute({
    customerId,
    barberId,
    service,
    startAt,
    endAt,
  }: CreateAppointmentRequest): Promise<CreateAppointmentResponse> {
    const appointment = new Appointment({
      id: v4(),
      customerId,
      barberId,
      status: 'CONFIRMED',
      service,
      startAt,
      endAt,
    })

    const hasConflict = await this.appointmentRepo.findConflictingAppointment(
      barberId,
      appointment.startAt,
      appointment.endAt
    )

    if (hasConflict) {
      throw new Error('Unavailable time for this appointment.')
    }

    await this.appointmentRepo.create(appointment)

    return appointment
  }
}

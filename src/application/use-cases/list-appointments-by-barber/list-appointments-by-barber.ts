import { Appointment } from '../../../domain/entities/appointment'
import { IAppointmentRepository } from '../../../interfaces/repositories/appointment-repository'

interface ListAppointmentsByBarberRequest {
  barberId: string
}

type ListAppointmentsByBarberResponse = Appointment[]

export class ListAppointmentsByBarber {
  constructor(private appointmentRepo: IAppointmentRepository) {}

  async execute({
    barberId,
  }: ListAppointmentsByBarberRequest): Promise<ListAppointmentsByBarberResponse> {
    const appointments = await this.appointmentRepo.getAllByBarberId(barberId)

    return appointments
  }
}

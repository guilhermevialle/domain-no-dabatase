import { Appointment } from '../../../domain/entities/appointment'
import { IAppointmentRepository } from '../../../interfaces/repositories/appointment-repository'
import { IBarberRepository } from '../../../interfaces/repositories/barber-repository'

interface ListBarberAppointmentsRequest {
  id: string
}

type ListBarberAppointmentsResponse = Appointment[]

export class ListBarberAppointments {
  constructor(
    private appointmentRepo: IAppointmentRepository,
    private barberRepo: IBarberRepository
  ) {}

  async execute({
    id,
  }: ListBarberAppointmentsRequest): Promise<ListBarberAppointmentsResponse> {
    const barber = await this.barberRepo.findById(id)

    if (!barber) throw new Error('barber not found.')

    const appointments = await this.appointmentRepo.findManyByBarberId(id)

    return appointments
  }
}

import { Appointment } from '../../../domain/entities/appointment'
import { IAppointmentRepository } from '../../../interfaces/repositories/appointment-repository'

type ListAppointmentsRequest =
  | { customerId: string; barberId?: never }
  | { barberId: string; customerId?: never }

type ListAppointmentsResponse = Appointment[]

export class ListAppointments {
  constructor(private appointmentRepo: IAppointmentRepository) {}

  async execute({
    barberId,
    customerId,
  }: ListAppointmentsRequest): Promise<ListAppointmentsResponse> {
    if (customerId) return this.appointmentRepo.getAllByCustomerId(customerId)
    if (barberId) return this.appointmentRepo.getAllByBarberId(barberId)

    throw new Error('Either customerId or barberId must be provided.')
  }
}

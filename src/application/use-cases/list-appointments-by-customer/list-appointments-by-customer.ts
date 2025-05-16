import { Appointment } from '../../../domain/entities/appointment'
import { IAppointmentRepository } from '../../../interfaces/repositories/appointment-repository'

interface ListAppointmentsByCustomerRequest {
  customerId: string
}
type ListAppointmentsByCustomerResponse = Appointment[]

export class ListAppointmentsByCustomer {
  constructor(private appointmentRepo: IAppointmentRepository) {}

  async execute({
    customerId,
  }: ListAppointmentsByCustomerRequest): Promise<ListAppointmentsByCustomerResponse> {
    const appointments =
      await this.appointmentRepo.getAllByCustomerId(customerId)

    return appointments
  }
}

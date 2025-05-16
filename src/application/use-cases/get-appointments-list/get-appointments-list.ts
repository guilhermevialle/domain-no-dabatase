import { Appointment } from '../../../domain/entities/appointment'
import { IAppointmentRepository } from '../../../interfaces/repositories/appointment-repository'

type GetAppointmentListRequest =
  | { customerId: string; barberId?: never }
  | { barberId: string; customerId?: never }

type GetAppointmentListResponse = Appointment[]

export class GetAppointmentList {
  constructor(private appointmentRepo: IAppointmentRepository) {}

  async execute({
    barberId,
    customerId,
  }: GetAppointmentListRequest): Promise<GetAppointmentListResponse> {
    if (customerId) return this.appointmentRepo.getAllByCustomerId(customerId)
    if (barberId) return this.appointmentRepo.getAllByBarberId(barberId)

    throw new Error('Either customerId or barberId must be provided.')
  }
}

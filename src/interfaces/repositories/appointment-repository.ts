import { Appointment } from '../../domain/entities/appointment'

export interface IAppointmentRepository {
  create: (appointment: Appointment) => Promise<void>
  findConflictingAppointment: (
    barberId: string,
    startAt: Date,
    endAt: Date
  ) => Promise<Appointment | null>
  findById: (id: string) => Promise<Appointment | null>
  update: (appointment: Appointment) => Promise<void>
  getAllByCustomerId: (id: string) => Promise<Appointment[]>
  getAllByBarberId: (id: string) => Promise<Appointment[]>
}

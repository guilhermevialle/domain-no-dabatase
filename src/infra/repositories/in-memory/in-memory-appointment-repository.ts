import { areIntervalsOverlapping } from 'date-fns'
import { Appointment } from '../../../domain/entities/appointment'
import { IAppointmentRepository } from '../../../interfaces/repositories/appointment-repository'

export class InMemoryAppointmentRepository implements IAppointmentRepository {
  private items: Appointment[] = []

  async getAllByBarberId(id: string): Promise<Appointment[]> {
    const results = this.items.filter((item) => item.barberId === id)
    return results
  }

  async getAllByCustomerId(id: string): Promise<Appointment[]> {
    const results = this.items.filter((item) => item.customerId === id)
    return results
  }

  async update(appointment: Appointment): Promise<void> {
    const index = this.items.findIndex((item) => item.id === appointment.id)

    if (index === -1) throw new Error('Appointment not found.')

    this.items[index] = appointment
  }

  async findById(id: string): Promise<Appointment | null> {
    const item = this.items.find((item) => item.id === id)

    if (!item) return null

    return item
  }

  async create(appointment: Appointment): Promise<void> {
    this.items.push(appointment)
  }

  async findConflictingAppointment(
    barberId: string,
    startAt: Date,
    endAt: Date
  ): Promise<Appointment | null> {
    const conflictingAppointment = this.items.find((appointment) => {
      return (
        appointment.barberId === barberId &&
        appointment.status !== 'CANCELED' &&
        areIntervalsOverlapping(
          {
            start: startAt,
            end: endAt,
          },
          {
            start: appointment.startAt,
            end: appointment.endAt,
          },
          { inclusive: true }
        )
      )
    })

    return conflictingAppointment ?? null
  }
}

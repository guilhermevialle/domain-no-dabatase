import { areIntervalsOverlapping } from 'date-fns'
import { Appointment } from '../../../domain/entities/appointment'
import { IAppointmentRepository } from '../../../interfaces/repositories/appointment-repository'

export class InMemoryAppointmentRepository implements IAppointmentRepository {
  private storage: Appointment[] = []

  async create(appointment: Appointment): Promise<void> {
    this.storage.push(appointment)
  }

  async update(appointment: Appointment): Promise<void> {
    const index = this.storage.findIndex(
      (appointment) => appointment.id === appointment.id
    )
    if (index === -1) throw new Error('Appointment not found')

    this.storage[index] = appointment
  }

  async findById(id: string): Promise<Appointment | null> {
    const appointment = this.storage.find(
      (appointment) => appointment.id === id
    )
    return appointment ?? null
  }

  async findManyByBarberId(barberId: string): Promise<Appointment[]> {
    const results = this.storage.filter(
      (appointment) => appointment.barberId === barberId
    )

    return results
  }

  async findManyByCustomerId(customerId: string): Promise<Appointment[]> {
    const results = this.storage.filter(
      (appointment) => appointment.customerId === customerId
    )

    return results
  }

  async isOverlappingByDateAndBarberId(
    barberId: string,
    startAt: Date,
    endAt: Date
  ): Promise<boolean> {
    const overlappingAppointment = this.storage.find((appointment) => {
      return (
        appointment.barberId === barberId &&
        areIntervalsOverlapping(
          {
            start: appointment.startAt,
            end: appointment.endAt,
          },
          {
            start: startAt,
            end: endAt,
          },
          {
            inclusive: true,
          }
        )
      )
    })

    return !!overlappingAppointment
  }
}

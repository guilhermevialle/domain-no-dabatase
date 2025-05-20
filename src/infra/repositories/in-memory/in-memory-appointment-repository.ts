import { Appointment } from '../../../domain/entities/appointment'
import { IAppointmentRepository } from '../../../interfaces/repositories/appointment-repository'

export class InMemoryAppointmentRepository implements IAppointmentRepository {
  private storage: Appointment[] = []

  async create(appointment: Appointment): Promise<void> {
    this.storage.push(appointment)
  }

  async update(appointment: Appointment): Promise<void> {
    const index = this.storage.findIndex((a) => a.id === appointment.id)
    if (index === -1) throw new Error('Appointment not found')
    this.storage[index] = appointment
  }

  async findById(id: string): Promise<Appointment | null> {
    return this.storage.find((a) => a.id === id) ?? null
  }

  async findManyByBarberId(barberId: string): Promise<Appointment[]> {
    return this.storage.filter((a) => a.barberId === barberId)
  }

  async findManyByCustomerId(customerId: string): Promise<Appointment[]> {
    return this.storage.filter((a) => a.customerId === customerId)
  }
}

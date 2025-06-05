import { areIntervalsOverlapping } from 'date-fns';
import { Appointment } from '../../../domain/entities/appointment';
import { IAppointmentRepository } from '../../../interfaces/repositories/appointment-repository';

export class InMemoryAppointmentRepository implements IAppointmentRepository {
  private storage: Appointment[] = [];

  async findOverlappingByDateAndBarberId(
    barberId: string,
    startAt: Date,
    endAt: Date,
    ignoreAppointmentId?: string,
  ): Promise<Appointment | null> {
    const appointment = this.storage.find(
      (appointment) =>
        appointment.barberId === barberId &&
        appointment.id !== ignoreAppointmentId &&
        areIntervalsOverlapping(
          { start: startAt, end: endAt },
          { start: appointment.startAt, end: appointment.endAt },
          { inclusive: false },
        ),
    );

    return appointment ?? null;
  }

  async findManyExpiredAppointments(): Promise<Appointment[]> {
    return this.storage.filter(
      (appointment) =>
        appointment.status === 'EXPIRED' || appointment.startAt < new Date(),
    );
  }

  async create(appointment: Appointment): Promise<void> {
    this.storage.push(appointment);
  }

  async createMany(appointments: Appointment[]): Promise<void> {
    this.storage.push(...appointments);
  }
  async update(appointment: Appointment): Promise<void> {
    const index = this.storage.findIndex(
      (appointment) => appointment.id === appointment.id,
    );
    if (index === -1) throw new Error('Appointment not found');

    this.storage[index] = appointment;
  }

  async findById(id: string): Promise<Appointment | null> {
    const appointment = this.storage.find(
      (appointment) => appointment.id === id,
    );
    return appointment ?? null;
  }

  async findManyByBarberId(barberId: string): Promise<Appointment[]> {
    const results = this.storage.filter(
      (appointment) => appointment.barberId === barberId,
    );

    return results;
  }

  async findManyByCustomerId(customerId: string): Promise<Appointment[]> {
    const results = this.storage.filter(
      (appointment) => appointment.customerId === customerId,
    );

    return results;
  }

  async findManyByBarberIdInRange(
    barberId: string,
    startAt: Date,
    endAt: Date,
  ): Promise<Appointment[]> {
    return this.storage.filter((appointment) => {
      if (appointment.barberId !== barberId) return false;

      return areIntervalsOverlapping(
        { start: appointment.startAt, end: appointment.endAt },
        { start: startAt, end: endAt },
        { inclusive: true },
      );
    });
  }

  async isOverlappingByDateAndBarberId(
    barberId: string,
    startAt: Date,
    endAt: Date,
    ignoreAppointmentId?: string,
  ): Promise<boolean> {
    const appointments = this.storage.filter((appointment) => {
      return (
        appointment.barberId === barberId &&
        appointment.id !== ignoreAppointmentId
      );
    });

    return appointments.some((appointment) =>
      areIntervalsOverlapping(
        { start: appointment.startAt, end: appointment.endAt },
        { start: startAt, end: endAt },
        { inclusive: false },
      ),
    );
  }
}

import { Appointment } from '@/domain/entities/appointment';

export interface IAppointmentRepository {
  create: (appointment: Appointment) => Promise<void>;
  createMany: (appointments: Appointment[]) => Promise<void>;
  update: (appointment: Appointment) => Promise<void>;
  findById: (id: string) => Promise<Appointment | null>;
  findManyByBarberId: (id: string) => Promise<Appointment[]>;
  findManyByCustomerId: (id: string) => Promise<Appointment[]>;
  findManyExpiredAppointments: () => Promise<Appointment[]>;
  findOverlappingByDateAndBarberId: (
    barberId: string,
    startAt: Date,
    endAt: Date,
    ignoreAppointmentId?: string,
  ) => Promise<Appointment | null>;
  findManyByBarberIdInRange: (
    barberId: string,
    startAt: Date,
    endAt: Date,
  ) => Promise<Appointment[]>;
}

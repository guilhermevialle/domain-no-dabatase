import { BarberNotFoundError } from '@/application/errors/shared';
import { Appointment } from '@/domain/entities/appointment';
import { IAppointmentRepository } from '@/interfaces/repositories/appointment-repository.interface';
import { IBarberRepository } from '@/interfaces/repositories/barber-repository.interface';

interface ListBarberAppointmentsRequest {
  id: string;
}

type ListBarberAppointmentsResponse = Appointment[];

export class ListBarberAppointments {
  constructor(
    private appointmentRepo: IAppointmentRepository,
    private barberRepo: IBarberRepository,
  ) {}

  async execute({
    id,
  }: ListBarberAppointmentsRequest): Promise<ListBarberAppointmentsResponse> {
    const barber = await this.barberRepo.findById(id);

    if (!barber) throw new BarberNotFoundError();

    const appointments = await this.appointmentRepo.findManyByBarberId(id);

    return appointments;
  }
}

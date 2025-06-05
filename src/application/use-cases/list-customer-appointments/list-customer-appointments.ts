import { CustomerNotFoundError } from '@/application/errors/shared';
import { Appointment } from '@/domain/entities/appointment';
import { IAppointmentRepository } from '@/interfaces/repositories/appointment-repository.interface';
import { ICustomerRepository } from '@/interfaces/repositories/customer-repository.interface';

interface ListCustomerAppointmentsRequest {
  id: string;
}

type ListCustomerAppointmentsResponse = Appointment[];

export class ListCustomerAppointments {
  constructor(
    private appointmentRepo: IAppointmentRepository,
    private customerRepo: ICustomerRepository,
  ) {}

  async execute({
    id,
  }: ListCustomerAppointmentsRequest): Promise<ListCustomerAppointmentsResponse> {
    const customer = await this.customerRepo.findById(id);

    if (!customer) throw new CustomerNotFoundError();

    const appointments = await this.appointmentRepo.findManyByCustomerId(id);

    return appointments;
  }
}

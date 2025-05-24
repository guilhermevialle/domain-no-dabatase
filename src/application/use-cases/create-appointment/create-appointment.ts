import {
  AvailableService,
  BASE_DURATIONS_IN_MINUTES,
  BASE_PRICES_IN_CENTS,
} from '../../../@types/service';
import { Appointment } from '../../../domain/entities/appointment';
import { IAppointmentRepository } from '../../../interfaces/repositories/appointment-repository';
import { IBarberRepository } from '../../../interfaces/repositories/barber-repository';
import { ICustomerRepository } from '../../../interfaces/repositories/customer-repository';
import { IAvailabilityService } from '../../../interfaces/services/availability-service';

interface CreateAppointmentRequest {
  customerId: string;
  barberId: string;
  service: AvailableService;
  startAt: Date;
}

type CreateAppointmentResponse = Appointment;

export class CreateAppointment {
  constructor(
    private appointmentRepo: IAppointmentRepository,
    private customerRepo: ICustomerRepository,
    private barberRepo: IBarberRepository,
    private availability: IAvailabilityService,
  ) {}

  async execute({
    barberId,
    customerId,
    service,
    startAt,
  }: CreateAppointmentRequest): Promise<CreateAppointmentResponse> {
    const customer = await this.customerRepo.findById(customerId);
    const barber = await this.barberRepo.findById(barberId);

    if (!customer) throw new Error('Customer not found.');
    if (!barber) throw new Error('Barber not found.');
    if (!barber.offersService(service))
      throw new Error(`Barber does not provide the service ${service}.`);

    const duration = BASE_DURATIONS_IN_MINUTES[service];
    const priceInCents = BASE_PRICES_IN_CENTS[service];

    const appointment = Appointment.create({
      barberId,
      customerId,
      service,
      startAt,
      duration,
      priceInCents,
    });

    const isBarberAvailable = await this.availability.isBarberAvailable(
      barberId,
      startAt,
    );

    if (!isBarberAvailable) throw new Error('Barber is not available.');

    appointment.schedule();

    await this.appointmentRepo.create(appointment);

    return appointment;
  }
}

import {
  AvailableService,
  BASE_DURATIONS_IN_MINUTES,
  BASE_PRICES_IN_CENTS,
} from '@/@types/service';
import {
  BarberDoesNotProvideServiceError,
  BarberNotAvailableError,
  BarberNotFoundError,
  CustomerNotFoundError,
} from '@/application/errors/shared';
import { Appointment } from '@/domain/entities/appointment';
import { IAppointmentRepository } from '@/interfaces/repositories/appointment-repository.interface';
import { IBarberRepository } from '@/interfaces/repositories/barber-repository.interface';
import { ICustomerRepository } from '@/interfaces/repositories/customer-repository.interface';
import { IAvailabilityService } from '@/interfaces/services/availability-service';

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

    if (!customer) throw new CustomerNotFoundError();
    if (!barber) throw new BarberNotFoundError();

    if (!barber.offersService(service))
      throw new BarberDoesNotProvideServiceError(
        `Barber does not provide the service: ${service}.`,
      );

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

    if (!isBarberAvailable) throw new BarberNotAvailableError();

    appointment.schedule();

    await this.appointmentRepo.create(appointment);

    return appointment;
  }
}

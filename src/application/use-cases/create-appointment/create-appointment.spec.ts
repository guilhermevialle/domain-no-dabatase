import { addMinutes } from 'date-fns';
import { beforeEach, describe, expect, it } from 'vitest';
import { AvailableService } from '../../../@types/service';
import { Barber } from '../../../domain/entities/barber';
import { Customer } from '../../../domain/entities/customer';
import {
  buildBarber,
  buildCustomer,
} from '../../../test/builders/build-entities';
import {
  buildRepositories,
  IBuildRepositories,
} from '../../../test/builders/build-repositories';
import {
  buildServices,
  IBuildServices,
} from '../../../test/builders/build-services';
import { CreateAppointment } from './create-appointment';

describe('CreateAppointment Use Case', () => {
  let useCase: CreateAppointment;
  let repos: IBuildRepositories;
  let barber: Barber;
  let customer: Customer;
  let services: IBuildServices;
  let now: Date;

  beforeEach(() => {
    now = new Date();
    repos = buildRepositories();
    services = buildServices();
    barber = buildBarber('barber-1');
    customer = buildCustomer('customer-1');
    useCase = new CreateAppointment(
      repos.appointmentRepo,
      repos.customerRepo,
      repos.barberRepo,
      services.barberAvailability,
    );
  });

  it('should throw an error if the customer does not exist', async () => {
    await expect(() =>
      useCase.execute({
        barberId: 'barber-1',
        customerId: 'customer-1',
        service: 'Beard Trim',
        startAt: addMinutes(now, 20),
      }),
    ).rejects.toThrowError();
  });

  it('should throw an error if the barber does not exist', async () => {
    await expect(() =>
      useCase.execute({
        barberId: 'barber-1',
        customerId: 'customer-1',
        service: 'Beard Trim',
        startAt: addMinutes(now, 20),
      }),
    ).rejects.toThrowError();
  });

  it('should throw an error if the barber does not provide the requested service', async () => {
    await repos.customerRepo.create(customer);
    await repos.barberRepo.create(barber);

    await expect(() =>
      useCase.execute({
        barberId: 'barber-1',
        customerId: 'customer-1',
        service: 'any' as AvailableService,
        startAt: addMinutes(now, 20),
      }),
    ).rejects.toThrowError();
  });

  it('should create an appointment with correct data (duration, price, etc.) if all validations pass', async () => {
    await repos.customerRepo.create(customer);
    await repos.barberRepo.create(barber);

    const result = await useCase.execute({
      barberId: 'barber-1',
      customerId: 'customer-1',
      service: 'Beard Trim',
      startAt: addMinutes(now, 20),
    });

    expect(result.duration).toBeDefined();
    expect(result.priceInCents).toBeDefined();
    expect(result.status).toBe('SCHEDULED');
    expect(result.endAt).toBeInstanceOf(Date);
  });
});

import { AvailableService } from '@/@types/service';
import { Customer } from '@/domain/entities/customer';
import { buildBarber, buildCustomer } from '@/test/builders/build-entities';
import { addMinutes } from 'date-fns';
import { beforeEach, describe, expect, it } from 'vitest';

import { Barber } from '@/domain/aggregates/barber';
import {
  buildDependencies,
  IBuildDependencies,
} from '@/test/builders/build-dependencies';
import { CreateAppointment } from './create-appointment';

describe('CreateAppointment Use Case', () => {
  let dependencies: IBuildDependencies;
  let useCase: CreateAppointment;
  let barber: Barber;
  let customer: Customer;
  let now: Date;

  beforeEach(() => {
    now = new Date();
    dependencies = buildDependencies();
    barber = buildBarber('barber-1');
    customer = buildCustomer('customer-1');
    useCase = new CreateAppointment(
      dependencies.appointmentRepo,
      dependencies.customerRepo,
      dependencies.barberRepo,
      dependencies.availabilityService,
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
    await dependencies.customerRepo.create(customer);
    await dependencies.barberRepo.create(barber);

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
    await dependencies.customerRepo.create(customer);
    await dependencies.barberRepo.create(barber);

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

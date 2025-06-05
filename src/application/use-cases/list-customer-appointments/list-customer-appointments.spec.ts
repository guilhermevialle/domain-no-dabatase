import { Customer } from '@/domain/entities/customer';
import {
  buildDependencies,
  IBuildDependencies,
} from '@/test/builders/build-dependencies';
import {
  buildAppointment,
  buildCustomer,
} from '@/test/builders/build-entities';
import { beforeEach, describe, expect, it } from 'vitest';
import { ListCustomerAppointments } from './list-customer-appointments';

describe('ListCustomerAppointments Use Case', () => {
  let dependencies: IBuildDependencies;
  let customer: Customer;
  let useCase: ListCustomerAppointments;

  beforeEach(() => {
    dependencies = buildDependencies();
    customer = buildCustomer('customer-1');
    useCase = new ListCustomerAppointments(
      dependencies.appointmentRepo,
      dependencies.customerRepo,
    );
  });

  it('should throw an error if the customer is not found', async () => {
    await expect(() =>
      useCase.execute({ id: 'invalid-id' }),
    ).rejects.toThrowError();
  });

  it('should return the list of appointments for the given customer id', async () => {
    await dependencies.customerRepo.create(customer);
    await dependencies.appointmentRepo.createMany([
      buildAppointment({
        barberId: 'barber-1',
        customerId: customer.id!,
      }),
      buildAppointment({
        barberId: 'barber-1',
        customerId: customer.id!,
      }),
    ]);

    const appointments = await useCase.execute({ id: customer.id! });

    expect(appointments).toHaveLength(2);
  });
});

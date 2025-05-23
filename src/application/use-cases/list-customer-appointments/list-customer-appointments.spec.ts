import { beforeEach, describe, expect, it } from 'vitest';
import { Customer } from '../../../domain/entities/customer';
import {
  buildAppointment,
  buildCustomer,
} from '../../../test/builders/build-entities';
import {
  buildRepositories,
  IBuildRepositories,
} from '../../../test/builders/build-repositories';
import { ListCustomerAppointments } from './list-customer-appointments';

describe('ListCustomerAppointments Use Case', () => {
  let repos: IBuildRepositories;
  let customer: Customer;
  let useCase: ListCustomerAppointments;

  beforeEach(() => {
    repos = buildRepositories();
    customer = buildCustomer('customer-1');
    useCase = new ListCustomerAppointments(
      repos.appointmentRepo,
      repos.customerRepo,
    );
  });

  it('should throw an error if the customer is not found', async () => {
    await expect(() =>
      useCase.execute({ id: 'invalid-id' }),
    ).rejects.toThrowError();
  });

  it('should return the list of appointments for the given customer id', async () => {
    await repos.customerRepo.create(customer);
    await repos.appointmentRepo.createMany([
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

import { beforeEach, describe, expect, it } from 'vitest';
import { Customer } from '../../../domain/entities/customer';
import {
  buildDependencies,
  IBuildDependecies,
} from '../../../test/builders/build-dependencies';
import {
  buildAppointment,
  buildCustomer,
} from '../../../test/builders/build-entities';
import { ListCustomerAppointments } from './list-customer-appointments';

describe('ListCustomerAppointments Use Case', () => {
  let dependecies: IBuildDependecies;
  let customer: Customer;
  let useCase: ListCustomerAppointments;

  beforeEach(() => {
    dependecies = buildDependencies();
    customer = buildCustomer('customer-1');
    useCase = new ListCustomerAppointments(
      dependecies.appointmentRepo,
      dependecies.customerRepo,
    );
  });

  it('should throw an error if the customer is not found', async () => {
    await expect(() =>
      useCase.execute({ id: 'invalid-id' }),
    ).rejects.toThrowError();
  });

  it('should return the list of appointments for the given customer id', async () => {
    await dependecies.customerRepo.create(customer);
    await dependecies.appointmentRepo.createMany([
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

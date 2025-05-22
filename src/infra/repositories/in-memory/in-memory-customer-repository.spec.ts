import { beforeEach, describe, expect, it } from 'vitest';
import { Customer } from '../../../domain/entities/customer';
import { Email } from '../../../domain/value-objects/email';
import { BrazilPhone } from '../../../domain/value-objects/phone';
import { ICustomerRepository } from '../../../interfaces/repositories/customer-repository';
import { InMemoryCustomerRepository } from './in-memory-customer-repository';

describe('InMemoryCustomerRepository', () => {
  let customerRepo: ICustomerRepository;
  let customer: Customer;

  beforeEach(() => {
    customerRepo = new InMemoryCustomerRepository();
    customer = new Customer({
      fullName: 'John Doe',
      email: new Email('WQH3T@example.com'),
      phone: new BrazilPhone('27999999999'),
    });
  });

  it('should store a new customer', async () => {
    await customerRepo.create(customer);
    const result = await customerRepo.findById(customer.id!);
    expect(result).toEqual(customer);
  });

  it('should update an existing customer', async () => {
    await customerRepo.create(customer);
    await customerRepo.update(
      new Customer({
        ...customer.toJSON(),
        fullName: 'John Doe Jr.',
      }),
    );
    const result = await customerRepo.findById(customer.id!);
    expect(result?.fullName).toBe('John Doe Jr.');
  });

  it('should return a customer by id if it exists', async () => {
    await customerRepo.create(customer);
    const result = await customerRepo.findById(customer.id!);
    expect(result).toEqual(customer);
  });

  it('should return null if no customer is found with the given id', async () => {
    const result = await customerRepo.findById('invalid-id');
    expect(result).toBeNull();
  });
});

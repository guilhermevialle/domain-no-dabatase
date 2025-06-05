import { beforeEach, describe, expect, it } from 'vitest';
import { Customer } from '../../../domain/entities/customer';
import { BrazilPhone } from '../../../domain/value-objects/brazil-phone';
import { Email } from '../../../domain/value-objects/email';
import { ICustomerRepository } from '../../../interfaces/repositories/customer-repository.interface';
import { InMemoryCustomerRepository } from './in-memory-customer.repository';

describe('InMemory Customer Repository', () => {
  let customerRepo: ICustomerRepository;
  let customer: Customer;

  beforeEach(() => {
    customerRepo = new InMemoryCustomerRepository();
    customer = Customer.create({
      fullName: 'John Doe',
      email: Email.create('WQH3T@example.com'),
      phone: BrazilPhone.create('27999999999'),
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
      Customer.restore({
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

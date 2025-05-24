import { beforeEach, describe, expect, it } from 'vitest';
import { BrazilPhone } from '../value-objects/brazil-phone';
import { Email } from '../value-objects/email';
import { Customer } from './customer';

describe('Customer Entity', () => {
  let customer: Customer;

  beforeEach(() => {
    customer = Customer.create({
      fullName: 'John Doe',
      email: Email.create('WQH3T@example.com'),
      phone: BrazilPhone.create('27999999999'),
    });
  });

  it('should create a Customer with generated id if not provided', () => {
    expect(customer.id).toBeDefined();
  });
});

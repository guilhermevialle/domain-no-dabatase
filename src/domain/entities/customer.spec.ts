import { beforeEach, describe, expect, it } from 'vitest';
import { Email } from '../value-objects/email';
import { BrazilPhone } from '../value-objects/phone';
import { Customer } from './customer';

describe('Customer Entity', () => {
  let customer: Customer;

  beforeEach(() => {
    customer = new Customer({
      fullName: 'John Doe',
      email: new Email('WQH3T@example.com'),
      phone: new BrazilPhone('27999999999'),
    });
  });

  it('should create a Customer with generated id if not provided', () => {
    expect(customer.id).toBeDefined();
  });
});

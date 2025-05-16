import { beforeEach, describe, expect, it } from 'vitest'
import { CreateCustomer } from './create-customer'

import { Customer } from '../../../domain/entities/customer'
import { Email } from '../../../domain/value-objects/email'
import { BrazilPhone } from '../../../domain/value-objects/phone'
import { InMemoryCustomerRepository } from '../../../infra/repositories/in-memory/in-memory-customer-repository'

describe('CreateCustomer Use Case', () => {
  let customerRepo: InMemoryCustomerRepository
  let createCustomer: CreateCustomer

  beforeEach(() => {
    customerRepo = new InMemoryCustomerRepository()
    createCustomer = new CreateCustomer(customerRepo)
  })

  it('should create a new customer successfully', async () => {
    const input = {
      id: 'customer-1',
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '(27) 99999-9999',
    }

    const customer = await createCustomer.execute(input)

    expect(customer).toBeInstanceOf(Customer)
    expect(customer.id).toBe('customer-1')
    expect(customer.email).toBe('john@example.com')
    expect(customer.phone).toBe('5527999999999')
  })

  it('should throw if customer with same id already exists', async () => {
    const input = {
      id: 'customer-1',
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      phone: '27999999999',
    }

    // Pre-populate with existing customer
    const existing = new Customer({
      id: input.id,
      fullName: input.fullName,
      email: new Email(input.email),
      phone: new BrazilPhone(input.phone),
    })

    await customerRepo.create(existing)

    await expect(() => createCustomer.execute(input)).rejects.toThrowError(
      'Email already registered.'
    )
  })
})

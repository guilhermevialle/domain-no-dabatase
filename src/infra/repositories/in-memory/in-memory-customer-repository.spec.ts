import { beforeEach, describe, expect, it } from 'vitest'
import { Customer } from '../../../domain/entities/customer'
import { Email } from '../../../domain/value-objects/email'
import { BrazilPhone } from '../../../domain/value-objects/phone'
import { InMemoryCustomerRepository } from './in-memory-customer-repository'

describe('InMemoryCustomerRepository', () => {
  let repo: InMemoryCustomerRepository

  beforeEach(() => {
    repo = new InMemoryCustomerRepository()
  })

  it('should create and store a customer', async () => {
    const customer = new Customer({
      id: 'customer-1',
      fullName: 'John Doe',
      email: new Email('johndoe@gmail.com'),
      phone: new BrazilPhone('27999999999'),
    })

    await repo.create(customer)

    const found = await repo.findByid('customer-1')

    expect(found).not.toBeNull()
    expect(found?.id).toBe('customer-1')
    expect(found?.fullName).toBe('John Doe')
    expect(found?.email).toBe('johndoe@gmail.com')
    expect(found?.phone).toBe('5527999999999')
  })

  it('should return null if customer not found', async () => {
    const found = await repo.findByid('non-existent-id')
    expect(found).toBeNull()
  })
})

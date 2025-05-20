import { describe, expect, it } from 'vitest'
import { Email } from '../value-objects/email'
import { BrazilPhone } from '../value-objects/phone'
import { Customer } from './customer'

describe('Customer Entity', () => {
  it('should create a valid customer', () => {
    const customer = new Customer({
      id: '1',
      fullName: 'Customer Test',
      email: new Email('test@example.com'),
      phone: new BrazilPhone('+5511999999999'),
    })

    expect(customer.fullName).toBe('Customer Test')
    expect(customer.email).toBe('test@example.com')
    expect(customer.phone).toBe('5511999999999')
  })
})

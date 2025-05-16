import { v4 } from 'uuid'
import { describe, expect, it } from 'vitest'
import { Email } from '../value-objects/email'
import { Phone } from '../value-objects/phone'
import { Customer } from './customer'

describe('Customer entity', () => {
  const validEmail = new Email('test@example.com')
  const validPhone = new Phone('+5511912345678')

  it('should create a Customer with all valid props and generate id if not provided', () => {
    const customer = new Customer({
      id: v4(),
      fullName: 'John Doe',
      email: validEmail,
      phone: validPhone,
    })

    expect(customer.id).toBeDefined()
    expect(customer.fullName).toBe('John Doe')
    expect(customer.email).toBe('test@example.com')
    expect(customer.phone).toBe('+5511912345678')
  })

  it('should keep the provided id if given', () => {
    const customId = v4()
    const customer = new Customer({
      id: customId,
      fullName: 'Jane Smith',
      email: validEmail,
      phone: validPhone,
    })

    expect(customer.id).toBe(customId)
  })

  it('email and phone getters should return their underlying values', () => {
    const customer = new Customer({
      id: v4(),
      fullName: 'Alice',
      email: validEmail,
      phone: validPhone,
    })

    expect(customer.email).toBe(validEmail.value)
    expect(customer.phone).toBe(validPhone.value)
  })
})

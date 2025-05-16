import { describe, expect, it } from 'vitest'
import { Phone } from './phone'

describe('Phone Value Object (Brazil)', () => {
  it('should create phone with valid input (formatted)', () => {
    const phone = new Phone('(11) 91234-5678')
    expect(phone.value).toBe('+5511912345678')
  })

  it('should create phone with raw digits', () => {
    const phone = new Phone('5511987654321')
    expect(phone.value).toBe('+5511987654321')
  })

  it('should create phone with +55 prefix', () => {
    const phone = new Phone('+55 11 98765-4321')
    expect(phone.value).toBe('+5511987654321')
  })

  it('should throw for invalid phone', () => {
    expect(() => new Phone('119999')).toThrow('Invalid phone number.')
    expect(() => new Phone('abcd')).toThrow('Invalid phone number.')
    expect(() => new Phone('')).toThrow('Invalid phone number.')
    expect(() => new Phone('55119999')).toThrow('Invalid phone number.')
    expect(() => new Phone('991234567')).toThrow('Invalid phone number.') // sem DDD
  })
})

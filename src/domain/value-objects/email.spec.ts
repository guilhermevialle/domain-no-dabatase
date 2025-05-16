import { describe, expect, it } from 'vitest'
import { Email } from './email'

describe('Email Value Object', () => {
  it('should create valid email with valid input', () => {
    expect(() => new Email('TEST@Example.com')).not.toThrow()
  })

  it('should create a valid email in lowercase', () => {
    const email = new Email('TEST@Example.com')
    expect(email.value).toBe('test@example.com')
  })

  it('should throw if email is invalid', () => {
    expect(() => new Email('invalid-email')).toThrow('Invalid email.')
    expect(() => new Email('')).toThrow('Invalid email.')
    expect(() => new Email('example@')).toThrow('Invalid email.')
    expect(() => new Email('@domain.com')).toThrow('Invalid email.')
  })

  it('should accept already-lowercased email without change', () => {
    const email = new Email('user@domain.com')
    expect(email.value).toBe('user@domain.com')
  })
})

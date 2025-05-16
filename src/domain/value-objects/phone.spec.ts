import { describe, expect, it } from 'vitest'
import { BrazilPhone } from './phone'

describe('BrazilPhone', () => {
  it('should accept valid phone number with country code', () => {
    const phone = new BrazilPhone('5527999999999')
    expect(phone.value).toBe('5527999999999')
  })

  it('should accept valid phone number without country code', () => {
    const phone = new BrazilPhone('27999999999')
    expect(phone.value).toBe('5527999999999')
  })

  it('should accept valid formatted phone number', () => {
    const phone = new BrazilPhone('(27) 99999-9999')
    expect(phone.value).toBe('5527999999999')
  })

  it('should accept valid formatted phone with country code', () => {
    const phone = new BrazilPhone('+55 (27) 99999-9999')
    expect(phone.value).toBe('5527999999999')
  })

  it('should throw error for phone number with invalid DDD', () => {
    expect(() => new BrazilPhone('(00) 99999-9999')).toThrowError(
      'Invalid Brazilian phone number. Must have a valid DDD and 8-9 digits after DDD.'
    )
  })

  it('should throw error for phone number with less than 10 digits', () => {
    expect(() => new BrazilPhone('279999999')).toThrowError(
      'Invalid Brazilian phone number. Must have a valid DDD and 8-9 digits after DDD.'
    )
  })

  it('should throw error for phone number with more than 11 digits after DDD', () => {
    expect(() => new BrazilPhone('279999999999')).toThrowError(
      'Invalid Brazilian phone number. Must have a valid DDD and 8-9 digits after DDD.'
    )
  })

  it('should normalize different formats to the same internal value', () => {
    const phone1 = new BrazilPhone('27999999999')
    const phone2 = new BrazilPhone('(27) 99999-9999')
    const phone3 = new BrazilPhone('+55 (27) 99999-9999')

    expect(phone1.value).toBe('5527999999999')
    expect(phone2.value).toBe('5527999999999')
    expect(phone3.value).toBe('5527999999999')
  })
})

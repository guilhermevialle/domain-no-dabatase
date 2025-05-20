import { describe, expect, it } from 'vitest'
import { AVAILABLE_SERVICES } from '../../@types/service'
import { Barber } from './barber'

describe('Barber', () => {
  const validProps = {
    since: new Date(),
    fullName: 'John Doe',
    services: [AVAILABLE_SERVICES[0]],
  }

  it('should return true if canDoService is called with a valid service', () => {
    const barber = new Barber(validProps)
    expect(barber.canDoService(AVAILABLE_SERVICES[0])).toBe(true)
  })

  it('should return false if canDoService is called with an invalid service', () => {
    const barber = new Barber(validProps)
    expect(barber.canDoService(AVAILABLE_SERVICES[1])).toBe(false)
  })

  it('should create a Barber with default bufferMinutes = 10', () => {
    const barber = new Barber(validProps)
    expect(barber.bufferMinutes).toBe(10)
  })

  it('should allow setting bufferMinutes within valid range and multiple of 5', () => {
    const barber = new Barber({ ...validProps, bufferMinutes: 15 })
    expect(barber.bufferMinutes).toBe(15)
  })

  it('should throw if bufferMinutes is not multiple of 5', () => {
    expect(() => {
      new Barber({ ...validProps, bufferMinutes: 7 })
    }).toThrow('Buffer time must be in 5-minute increments.')
  })

  it('should throw if bufferMinutes is less than 5', () => {
    expect(() => {
      new Barber({ ...validProps, bufferMinutes: 0 })
    }).toThrow('Buffer time must be between 5 and 30 minutes.')
  })

  it('should throw if bufferMinutes is greater than 30', () => {
    expect(() => {
      new Barber({ ...validProps, bufferMinutes: 35 })
    }).toThrow('Buffer time must be between 5 and 30 minutes.')
  })

  it('should throw if no services provided', () => {
    expect(() => {
      new Barber({ ...validProps, services: [] })
    }).toThrow('Must have at least 1 specialty.')
  })

  it('should throw if duplicate services are provided', () => {
    expect(() => {
      new Barber({
        ...validProps,
        services: [AVAILABLE_SERVICES[0], AVAILABLE_SERVICES[0]],
      })
    }).toThrow('Duplicate services are not allowed.')
  })
})

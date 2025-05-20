import { describe, expect, it } from 'vitest'
import { AVAILABLE_SERVICES } from '../../@types/service'
import { Service } from './service'

describe('Service', () => {
  const validProps = {
    name: AVAILABLE_SERVICES[0],
    duration: 30,
    priceInCents: 2500,
  }

  it('should create a Service with valid props', () => {
    const service = new Service(validProps)
    expect(service.name).toBe(validProps.name)
    expect(service.duration).toBe(validProps.duration)
    expect(service.priceInCents).toBe(validProps.priceInCents)
  })

  it('should throw if duration is zero or less', () => {
    expect(() => {
      new Service({ ...validProps, duration: 0 })
    }).toThrow('Invalid duration.')

    expect(() => {
      new Service({ ...validProps, duration: -5 })
    }).toThrow('Invalid duration.')
  })

  it('should throw if duration is not a multiple of 5', () => {
    expect(() => {
      new Service({ ...validProps, duration: 27 })
    }).toThrow('Duration must be a multiple of 5 minutes.')
  })
})

import { describe, expect, it } from 'vitest'
import { SERVICES } from '../../@types/barber'
import { Service } from './service'

describe('Service Value Object', () => {
  it('should create a valid Service instance', () => {
    const service = new Service({
      id: 'service-1',
      name: SERVICES.beard_trim,
    })

    expect(service).toBeInstanceOf(Service)
    expect(service.id).toBe('service-1')
    expect(service.name).toBe(SERVICES.beard_trim)
  })

  it('should throw error if invalid service name is provided', () => {
    expect(() => {
      new Service({
        id: 'service-2',
        // @ts-expect-error testing invalid name
        name: 'Invalid Service',
      })
    }).toThrowError('Invalid service name: Invalid Service')
  })

  it('should return correct JSON representation', () => {
    const service = new Service({
      id: 'service-3',
      name: SERVICES.clean_shave,
    })

    expect(service.toJSON()).toEqual({
      id: 'service-3',
      name: SERVICES.clean_shave,
    })
  })
})

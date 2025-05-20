import { describe, expect, it } from 'vitest'
import { SERVICES } from '../../@types/service'
import { Service } from './service'

describe('Service Entity', () => {
  it('should create a valid service', () => {
    const service = new Service({
      name: SERVICES.beard_trim,
      price: 3500,
    })

    expect(service.name).toBe(SERVICES.beard_trim)
    expect(service.price).toBe(3500)
  })

  it('should throw if service name is invalid', () => {
    expect(() => {
      new Service({
        name: 'INVALID' as any,
        price: 1000,
      })
    }).toThrow('Invalid service name: INVALID')
  })
})

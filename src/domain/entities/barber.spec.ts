import { describe, expect, it } from 'vitest'
import { SERVICES } from '../../@types/service'
import { Barber } from './barber'

describe('Barber Entity', () => {
  it('should create a valid barber', () => {
    const barber = new Barber({
      since: new Date(),
      fullName: 'John Doe',
      services: [SERVICES.hair_coloring, SERVICES.beard_trim],
      bufferTimeMinutes: 15,
    })

    expect(barber.fullName).toBe('John Doe')
  })

  it('should throw if bufferTimeMinutes is less than 10 or greater than 20', () => {
    expect(() => {
      new Barber({
        since: new Date(),
        fullName: 'Jane',
        services: [SERVICES.hair_coloring],
        bufferTimeMinutes: 25,
      })
    }).toThrow('Buffer time must be between 10 and 20 minutes.')
  })

  it('should throw if duplicate services are provided', () => {
    expect(() => {
      new Barber({
        since: new Date(),
        fullName: 'Jane',
        services: [SERVICES.hair_coloring, SERVICES.hair_coloring],
        bufferTimeMinutes: 15,
      })
    }).toThrow('Duplicate services are not allowed.')
  })

  it('should throw if no services are provided', () => {
    expect(() => {
      new Barber({
        since: new Date(),
        fullName: 'Jane',
        services: [],
        bufferTimeMinutes: 15,
      })
    }).toThrow('Must have at least 1 specialty.')
  })
})

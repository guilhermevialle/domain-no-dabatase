import { describe, expect, it } from 'vitest'
import { SERVICES, Service } from '../../types/barber'
import { Barber } from './barber'

describe('Barber Entity', () => {
  const baseProps = {
    id: 'barber-123',
    since: new Date('2020-01-01'),
    fullName: 'John Doe',
  }

  it('should create a barber with valid specialties', () => {
    const services: Service[] = [
      SERVICES.beard_trim,
      SERVICES.clean_shave,
      SERVICES.fade_cut,
    ]

    const barber = new Barber({
      ...baseProps,
      services,
    })

    expect(barber.fullName).toBe(baseProps.fullName)
    expect(barber.id).toBe(baseProps.id)
  })

  it('should throw an error if specialties contain duplicates', () => {
    const specialtiesWithDuplicates: Service[] = [
      SERVICES.beard_trim,
      SERVICES.beard_trim,
      SERVICES.fade_cut,
    ]

    expect(() => {
      new Barber({
        ...baseProps,
        services: specialtiesWithDuplicates,
      })
    }).toThrow('Duplicate specialties are not allowed.')
  })

  it('should throw an error if specialties array is empty', () => {
    expect(() => {
      new Barber({
        ...baseProps,
        services: [],
      })
    }).toThrow('Must have at least 1 specialty.')
  })
})

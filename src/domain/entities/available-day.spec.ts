import { describe, expect, it } from 'vitest'
import { AvailableDay } from './available-day'

describe('AvailableDay', () => {
  it('should create a valid available day', () => {
    const availableDay = new AvailableDay({
      id: 'day-1',
      barberId: 'barber-1',
      weekday: 2,
    })

    expect(availableDay.id).toBe('day-1')
    expect(availableDay.barberId).toBe('barber-1')
    expect(availableDay.weekday).toBe(2)
  })

  it('should throw if weekday is less than 0', () => {
    expect(() => {
      new AvailableDay({
        id: 'day-2',
        barberId: 'barber-2',
        weekday: -1,
      })
    }).toThrowError('Weekday must be between 0 (Sunday) and 6 (Saturday).')
  })

  it('should throw if weekday is greater than 6', () => {
    expect(() => {
      new AvailableDay({
        id: 'day-3',
        barberId: 'barber-3',
        weekday: 7,
      })
    }).toThrowError('Weekday must be between 0 (Sunday) and 6 (Saturday).')
  })
})

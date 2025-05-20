import { describe, expect, it } from 'vitest'
import { AvailableDay } from './available-day'

describe('AvailableDay Entity', () => {
  it('creates available day with valid weekday', () => {
    const day = new AvailableDay({
      id: '1',
      barberId: 'barber-1',
      weekday: 2,
    })

    expect(day.weekday).toBe(2)
  })

  it('throws if weekday is invalid', () => {
    expect(() => {
      new AvailableDay({ id: '1', barberId: 'b1', weekday: 8 })
    }).toThrow('Weekday must be between 0 (Sunday) and 6 (Saturday).')
  })
})

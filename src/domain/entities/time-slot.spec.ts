import { describe, expect, it } from 'vitest'
import { Time } from '../value-objects/time'
import { TimeSlot } from './time-slot'

describe('TimeSlot Entity', () => {
  it('should create a valid time slot', () => {
    const start = new Time('09:00')
    const end = new Time('10:00')
    const slot = new TimeSlot({
      id: '1',
      availableDayId: 'day-1',
      start,
      end,
    })

    expect(slot.start.value).toBe('09:00')
    expect(slot.end.value).toBe('10:00')
  })

  it('should throw if start and end times are equal', () => {
    expect(() => {
      new TimeSlot({
        id: '1',
        availableDayId: 'day-1',
        start: new Time('10:00'),
        end: new Time('10:00'),
      })
    }).toThrow('Start and end times cannot be the same.')
  })

  it('should throw if start time is after end time', () => {
    expect(() => {
      new TimeSlot({
        id: '1',
        availableDayId: 'day-1',
        start: new Time('11:00'),
        end: new Time('10:00'),
      })
    }).toThrow('Start time must be before end time.')
  })
})

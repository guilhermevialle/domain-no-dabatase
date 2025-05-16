import { describe, expect, it } from 'vitest'
import { Time } from '../value-objects/time'
import { AvailableSlot } from './available-slot'

describe('AvailableSlot', () => {
  it('should create a valid available slot', () => {
    const slot = new AvailableSlot({
      id: 'slot-1',
      availableDayId: 'day-1',
      start: new Time('09:00'),
      end: new Time('12:00'),
    })

    expect(slot.start.value).toBe('09:00')
    expect(slot.end.value).toBe('12:00')
    expect(slot.availableDayId).toBe('day-1')
  })

  it('should throw if start time equals end time', () => {
    expect(() => {
      new AvailableSlot({
        id: 'slot-2',
        availableDayId: 'day-1',
        start: new Time('10:00'),
        end: new Time('10:00'),
      })
    }).toThrowError('Start and end times cannot be the same.')
  })

  it('should throw if start time is after end time', () => {
    expect(() => {
      new AvailableSlot({
        id: 'slot-3',
        availableDayId: 'day-1',
        start: new Time('18:00'),
        end: new Time('17:30'),
      })
    }).toThrowError('Start time must be before end time.')
  })
})

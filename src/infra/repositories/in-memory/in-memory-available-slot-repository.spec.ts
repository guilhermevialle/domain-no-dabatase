import { beforeEach, describe, expect, it } from 'vitest'
import { AvailableSlot } from '../../../domain/entities/available-slot'
import { Time } from '../../../domain/value-objects/time'
import { InMemoryAvailableSlotRepository } from './in-memory-available-slot'

describe('InMemoryAvailableSlotRepository', () => {
  let repository: InMemoryAvailableSlotRepository

  beforeEach(() => {
    repository = new InMemoryAvailableSlotRepository()
  })

  it('should create and retrieve slots by available day ID', async () => {
    const slot = new AvailableSlot({
      id: '1',
      availableDayId: 'day-1',
      start: new Time('09:00'),
      end: new Time('09:30'),
    })

    await repository.create(slot)

    const result = await repository.findByAvailableDayId('day-1')

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('1')
    expect(result[0].availableDayId).toBe('day-1')
  })

  it('should return empty array if no slots match the available day ID', async () => {
    const result = await repository.findByAvailableDayId('unknown')
    expect(result).toEqual([])
  })

  it('should list all available slots', async () => {
    const slot1 = new AvailableSlot({
      id: '1',
      availableDayId: 'day-1',
      start: new Time('10:00'),
      end: new Time('10:30'),
    })

    const slot2 = new AvailableSlot({
      id: '2',
      availableDayId: 'day-2',
      start: new Time('11:00'),
      end: new Time('11:30'),
    })

    await repository.create(slot1)
    await repository.create(slot2)

    const result = await repository.list()

    expect(result).toHaveLength(2)
    expect(result.map((s) => s.id)).toContain('1')
    expect(result.map((s) => s.id)).toContain('2')
  })
})

import { beforeEach, describe, expect, it } from 'vitest'
import { AvailableDay } from '../../../domain/entities/available-day'
import { InMemoryAvailableDayRepository } from './in-memory-available-day-repository'

describe('InMemoryAvailableDayRepository', () => {
  let repository: InMemoryAvailableDayRepository

  beforeEach(() => {
    repository = new InMemoryAvailableDayRepository()
  })

  it('should store and retrieve available day by barber and weekday', async () => {
    const day = new AvailableDay({ id: '1', barberId: 'barber-1', weekday: 4 })

    await repository.create(day)

    const result = await repository.findByBarberIdAndWeekday('barber-1', 4)

    expect(result).toBeTruthy()
    expect(result?.barberId).toBe('barber-1')
    expect(result?.weekday).toBe(4)
  })

  it('should return null for non-existing barber/weekday', async () => {
    const result = await repository.findByBarberIdAndWeekday('not-found', 1)
    expect(result).toBeNull()
  })

  it('should find all available days for a barber', async () => {
    const day1 = new AvailableDay({ id: '1', barberId: 'b-1', weekday: 2 })
    const day2 = new AvailableDay({ id: '2', barberId: 'b-1', weekday: 3 })
    const day3 = new AvailableDay({ id: '3', barberId: 'b-2', weekday: 2 })

    await repository.create(day1)
    await repository.create(day2)
    await repository.create(day3)

    const result = await repository.findManyByBarberId('b-1')

    expect(result.length).toBe(2)
    expect(result.map((d) => d.id)).toContain('1')
    expect(result.map((d) => d.id)).toContain('2')
  })

  it('should list all available days', async () => {
    const day = new AvailableDay({ id: 'd1', barberId: 'b', weekday: 1 })
    await repository.create(day)

    const result = await repository.list()
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('d1')
  })
})

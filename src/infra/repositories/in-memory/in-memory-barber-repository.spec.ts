import { beforeEach, describe, expect, it } from 'vitest'
import { Barber } from '../../../domain/entities/barber'
import { SERVICES } from '../../../types/barber'
import { InMemoryBarberRepository } from './in-memory-barber-repository'

describe('InMemoryBarberRepository', () => {
  let repo: InMemoryBarberRepository

  beforeEach(() => {
    repo = new InMemoryBarberRepository()
  })

  it('should find a barber by ID if exists', async () => {
    const barber = new Barber({
      id: 'barber-123',
      fullName: 'John Barber',
      since: new Date('2020-01-01'),
      services: [SERVICES.fade_cut],
    })

    await repo.create(barber)

    const result = await repo.findById('barber-123')

    expect(result).not.toBeNull()
    expect(result?.fullName).toBe('John Barber')
    expect(result?.specialties).toContain(SERVICES.fade_cut)
  })

  it('should return null if barber not found', async () => {
    const result = await repo.findById('non-existent-id')
    expect(result).toBeNull()
  })

  it('should append new barber to repository', async () => {
    const newBarber = new Barber({
      id: 'barber-456',
      fullName: 'Jane Barber',
      since: new Date('2022-05-10'),
      services: [SERVICES.hair_coloring],
    })

    await repo.create(newBarber)

    const found = await repo.findById('barber-456')
    expect(found).not.toBeNull()
    expect(found?.fullName).toBe('Jane Barber')
  })
})

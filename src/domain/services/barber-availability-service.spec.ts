import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Time } from '../value-objects/time'
import { BarberAvailabilityService } from './barber-availability-service'

describe('BarberAvailabilityService', () => {
  let barberRepo: any
  let availableDayRepo: any
  let timeSlotRepo: any
  let appointmentRepo: any
  let service: BarberAvailabilityService

  beforeEach(() => {
    barberRepo = {
      findById: vi.fn(),
    }
    availableDayRepo = {
      findByWeekdayAndBarberId: vi.fn(),
    }
    timeSlotRepo = {
      findManyByAvailableDayId: vi.fn(),
    }
    appointmentRepo = {
      isOverlappingByDateAndBarberId: vi.fn(),
    }
    service = new BarberAvailabilityService(
      appointmentRepo,
      barberRepo,
      availableDayRepo,
      timeSlotRepo
    )
  })

  it('should throw an error if the barber does not exist', async () => {
    barberRepo.findById.mockResolvedValue(null)

    await expect(
      service.isAvailableByBarberIdAndDate('barber1', new Date())
    ).rejects.toThrow('Barber not found.')
  })

  it('should throw an error if the barber is not available on the requested day', async () => {
    barberRepo.findById.mockResolvedValue({ id: 'barber1' })
    availableDayRepo.findByWeekdayAndBarberId.mockResolvedValue(null)

    await expect(
      service.isAvailableByBarberIdAndDate('barber1', new Date())
    ).rejects.toThrow('Barber is not available on this day.')
  })

  it('should throw an error if the barber has no time slots', async () => {
    barberRepo.findById.mockResolvedValue({ id: 'barber1' })
    availableDayRepo.findByWeekdayAndBarberId.mockResolvedValue({
      id: 'availableDay1',
    })
    timeSlotRepo.findManyByAvailableDayId.mockResolvedValue([])

    await expect(
      service.isAvailableByBarberIdAndDate('barber1', new Date())
    ).rejects.toThrow('Barber has no time slots.')
  })

  it('should throw an error if the requested time overlaps with another appointment', async () => {
    const startAt = new Date('2025-05-21T09:30:00Z')

    barberRepo.findById.mockResolvedValue({ id: 'barber1' })
    appointmentRepo.isOverlappingByDateAndBarberId.mockResolvedValue(true)

    await expect(
      service.isAvailableByBarberIdAndDate('barber1', startAt)
    ).rejects.toThrow('Barber is not available at this time.')
  })

  it('should return true if the barber is available at the requested time', async () => {
    const startAt = new Date('2025-05-21T09:30:00Z')
    const timeSlotStart = new Date('2025-05-21T09:00:00Z')
    const timeSlotEnd = new Date('2025-05-21T10:00:00Z')

    barberRepo.findById.mockResolvedValue({ id: 'barber1' })
    appointmentRepo.isOverlappingByDateAndBarberId.mockResolvedValue(false)
    availableDayRepo.findByWeekdayAndBarberId.mockResolvedValue({
      id: 'availableDay1',
    })
    timeSlotRepo.findManyByAvailableDayId.mockResolvedValue([
      { start: new Time(timeSlotStart), end: new Time(timeSlotEnd) },
    ])

    const result = await service.isAvailableByBarberIdAndDate(
      'barber1',
      startAt
    )
    expect(result).toBe(true)
  })

  it('should return false if the barber is not available at the requested time', async () => {
    const startAt = new Date('2025-05-21T11:30:00Z')
    const timeSlotStart = new Date('2025-05-21T09:00:00Z')
    const timeSlotEnd = new Date('2025-05-21T10:00:00Z')

    barberRepo.findById.mockResolvedValue({ id: 'barber1' })
    appointmentRepo.isOverlappingByDateAndBarberId.mockResolvedValue(false)
    availableDayRepo.findByWeekdayAndBarberId.mockResolvedValue({
      id: 'availableDay1',
    })
    timeSlotRepo.findManyByAvailableDayId.mockResolvedValue([
      { start: new Time(timeSlotStart), end: new Time(timeSlotEnd) },
    ])

    const result = await service.isAvailableByBarberIdAndDate(
      'barber1',
      startAt
    )
    expect(result).toBe(false)
  })
})

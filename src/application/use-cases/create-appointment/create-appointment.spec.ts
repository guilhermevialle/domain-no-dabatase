import { beforeEach, describe, expect, it } from 'vitest'
import { Appointment } from '../../../domain/entities/appointment'
import { InMemoryAppointmentRepository } from '../../../infra/repositories/in-memory/in-memory-appointment-repository'
import { SERVICES } from '../../../types/barber'
import { getFutureDate } from '../../../utils/get-future-date'
import { CreateAppointment } from './create-appointment'

describe('CreateAppointment Use Case', () => {
  let appointmentRepo: InMemoryAppointmentRepository
  let createAppointment: CreateAppointment

  const baseInput = {
    customerId: 'customer-1',
    barberId: 'barber-1',
    service: SERVICES.classic_haircut,
  }

  beforeEach(() => {
    appointmentRepo = new InMemoryAppointmentRepository()
    createAppointment = new CreateAppointment(appointmentRepo)
  })

  it('should create a new appointment successfully', async () => {
    const startAt = getFutureDate('2025-06-01 10:00')
    const endAt = getFutureDate('2025-06-01 10:30')

    const appointment = await createAppointment.execute({
      ...baseInput,
      startAt,
      endAt,
    })

    expect(appointment).toBeInstanceOf(Appointment)
    expect(appointment.status).toBe('CONFIRMED')
    expect(appointment.startAt).toEqual(startAt)
  })

  it('should throw if appointment is in the past', async () => {
    const startAt = new Date('2020-01-01 10:00')
    const endAt = new Date('2020-01-01 10:30')

    await expect(() =>
      createAppointment.execute({
        ...baseInput,
        startAt,
        endAt,
      })
    ).rejects.toThrow('Start date must be in the future.')
  })

  it('should throw if end date is before start date', async () => {
    const startAt = getFutureDate('2025-06-01 11:00')
    const endAt = getFutureDate('2025-06-01 10:00')

    await expect(() =>
      createAppointment.execute({
        ...baseInput,
        startAt,
        endAt,
      })
    ).rejects.toThrow('End date must be after start date.')
  })

  it('should throw if appointment is longer than 1h30', async () => {
    const startAt = getFutureDate('2025-06-01 10:00')
    const endAt = getFutureDate('2025-06-01 12:00')

    await expect(() =>
      createAppointment.execute({
        ...baseInput,
        startAt,
        endAt,
      })
    ).rejects.toThrow(
      'Appointment cannot be longer than 1 hour and 30 minutes.'
    )
  })

  it('should throw if service is not allowed', async () => {
    const startAt = getFutureDate('2025-06-01 10:00')
    const endAt = getFutureDate('2025-06-01 10:30')

    await expect(() =>
      createAppointment.execute({
        ...baseInput,
        service: 'INVALID_SERVICE' as any,
        startAt,
        endAt,
      })
    ).rejects.toThrow('Cannot create custom Appointment service.')
  })

  it('should throw if barber already has an appointment at the same time', async () => {
    const startAt = getFutureDate('2025-06-01 10:00')
    const endAt = getFutureDate('2025-06-01 10:30')

    // Create an existing appointment for the barber
    await createAppointment.execute({
      ...baseInput,
      startAt,
      endAt,
    })

    // Try to create a conflicting one
    await expect(() =>
      createAppointment.execute({
        ...baseInput,
        startAt: getFutureDate('2025-06-01 10:15'),
        endAt: getFutureDate('2025-06-01 10:45'),
      })
    ).rejects.toThrow('Unavailable time for this appointment.')
  })

  it('should allow overlapping appointments for different barbers', async () => {
    const startAt = getFutureDate('2025-06-01 10:00')
    const endAt = getFutureDate('2025-06-01 10:30')

    await createAppointment.execute({
      ...baseInput,
      startAt,
      endAt,
    })

    const otherBarberAppointment = await createAppointment.execute({
      ...baseInput,
      barberId: 'barber-2',
      startAt,
      endAt,
    })

    expect(otherBarberAppointment).toBeInstanceOf(Appointment)
  })
})

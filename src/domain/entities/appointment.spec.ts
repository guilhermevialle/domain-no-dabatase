import { addMinutes, subMinutes } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { describe, expect, it } from 'vitest'
import { SERVICES } from '../../types/barber'
import { Appointment } from './appointment'

describe('Appointment Entity', () => {
  const customerId = uuidv4()
  const service = SERVICES.kids_haircut

  it('should create a valid appointment', () => {
    const now = new Date()
    const startAt = addMinutes(now, 10)
    const endAt = addMinutes(startAt, 60)

    const appointment = new Appointment({
      id: uuidv4(),
      customerId,
      barberId: 'barber1',
      service,
      status: 'CONFIRMED',
      startAt,
      endAt,
    })

    expect(appointment).toBeInstanceOf(Appointment)
    expect(appointment.status).toBe('CONFIRMED')
  })

  it('should throw if service is not in allowed specialties', () => {
    const now = new Date()
    const startAt = addMinutes(now, 10)
    const endAt = addMinutes(startAt, 30)

    expect(() => {
      new Appointment({
        id: uuidv4(),
        customerId,
        barberId: 'barber1',
        service: 'CUSTOM_SERVICE' as any,
        status: 'CONFIRMED',
        startAt,
        endAt,
      })
    }).toThrow('Cannot create custom Appointment service.')
  })

  it('should throw if start date is in the past', () => {
    const now = new Date()
    const startAt = subMinutes(now, 1)
    const endAt = addMinutes(startAt, 30)

    expect(() => {
      new Appointment({
        id: uuidv4(),
        customerId,
        barberId: 'barber1',
        service,
        status: 'CONFIRMED',
        startAt,
        endAt,
      })
    }).toThrow('Start date must be in the future.')
  })

  it('should throw if end date is before start date', () => {
    const now = new Date()
    const startAt = addMinutes(now, 10)
    const endAt = subMinutes(startAt, 5)

    expect(() => {
      new Appointment({
        id: uuidv4(),
        customerId,
        barberId: 'barber1',
        service,
        status: 'CONFIRMED',
        startAt,
        endAt,
      })
    }).toThrow('End date must be after start date.')
  })

  it('should throw if appointment duration exceeds 90 minutes', () => {
    const now = new Date()
    const startAt = addMinutes(now, 10)
    const endAt = addMinutes(startAt, 91)

    expect(() => {
      new Appointment({
        id: uuidv4(),
        customerId,
        barberId: 'barber1',
        service,
        status: 'CONFIRMED',
        startAt,
        endAt,
      })
    }).toThrow('Appointment cannot be longer than 1 hour and 30 minutes.')
  })

  it('should allow cancellation if more than 5 minutes before start', () => {
    const now = new Date()
    const startAt = addMinutes(now, 10)
    const endAt = addMinutes(startAt, 30)

    const appointment = new Appointment({
      id: uuidv4(),
      customerId,
      barberId: 'barber1',
      service,
      status: 'CONFIRMED',
      startAt,
      endAt,
    })

    const cancelled = appointment.cancel()

    expect(cancelled.status).toBe('CANCELED')
  })

  it('should not allow cancellation if less than 5 minutes before start', () => {
    const now = new Date()
    const startAt = addMinutes(now, 4)
    const endAt = addMinutes(startAt, 30)

    const appointment = new Appointment({
      id: uuidv4(),
      customerId,
      barberId: 'barber1',
      service,
      status: 'CONFIRMED',
      startAt,
      endAt,
    })

    expect(() => {
      appointment.cancel()
    }).toThrow(
      'Cannot cancel appointment less than 5 minutes before the start time.'
    )
  })
})

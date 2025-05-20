import { addMinutes, getDay } from 'date-fns'
import { describe, expect, it } from 'vitest'
import {
  AVAILABLE_SERVICES,
  BASE_DURATIONS_IN_MINUTES,
  BASE_PRICES_IN_CENTS,
} from '../../@types/service'
import { Time } from '../value-objects/time'
import { Appointment } from './appointment'

describe('Appointment', () => {
  const now = new Date()
  const future = addMinutes(now, 30)
  const validService = AVAILABLE_SERVICES[0]

  it('should create an appointment with defaults using base duration and price', () => {
    const appointment = new Appointment({
      customerId: 'customer-id',
      barberId: 'barber-id',
      service: validService,
      startAt: future,
    })

    expect(appointment.duration).toBe(BASE_DURATIONS_IN_MINUTES[validService])
    expect(appointment.priceInCents).toBe(BASE_PRICES_IN_CENTS[validService])
    expect(appointment.status).toBe('SCHEDULED')
  })

  it('should reject invalid duration (not divisible by 5)', () => {
    expect(() => {
      new Appointment({
        customerId: 'c',
        barberId: 'b',
        service: validService,
        startAt: future,
        duration: 7,
      })
    }).toThrow('Duration must be a multiple of 5 minutes.')
  })

  it('should reject invalid service not listed in AVAILABLE_SERVICES', () => {
    expect(() => {
      new Appointment({
        customerId: 'c',
        barberId: 'b',
        service: 'Custom Service' as any,
        startAt: future,
        duration: 30,
      })
    }).toThrow('Cannot create custom Appointment service.')
  })

  it('should reject appointments scheduled in the past', () => {
    expect(() => {
      new Appointment({
        customerId: 'c',
        barberId: 'b',
        service: validService,
        startAt: addMinutes(new Date(), -5),
      })
    }).toThrow('Start date must be in the future.')
  })

  it('should cancel if more than 10 minutes before start', () => {
    const appointment = new Appointment({
      customerId: 'c',
      barberId: 'b',
      service: validService,
      startAt: addMinutes(new Date(), 30),
    })

    appointment.cancel()
    expect(appointment.status).toBe('CANCELED')
  })

  it('should not cancel if less than 10 minutes before start', () => {
    const appointment = new Appointment({
      customerId: 'c',
      barberId: 'b',
      service: validService,
      startAt: addMinutes(new Date(), 5),
    })

    expect(() => appointment.cancel()).toThrow(
      'Cannot cancel appointment less than 10 minutes before the start time.'
    )
  })

  it('should finish appointment and mark as FINISHED', () => {
    const appointment = new Appointment({
      customerId: 'c',
      barberId: 'b',
      service: validService,
      startAt: future,
    })

    appointment.finish()
    expect(appointment.status).toBe('FINISHED')
  })

  it('should return correct weekday using getDay()', () => {
    const appointment = new Appointment({
      customerId: 'c',
      barberId: 'b',
      service: validService,
      startAt: future,
    })

    expect(appointment.getDay()).toBe(getDay(future))
  })

  it('should return a Time object using getTime()', () => {
    const appointment = new Appointment({
      customerId: 'c',
      barberId: 'b',
      service: validService,
      startAt: future,
    })

    const time = appointment.getTime()
    expect(time).toBeInstanceOf(Time)
  })
})

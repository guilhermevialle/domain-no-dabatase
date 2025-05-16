import { addMinutes, subMinutes } from 'date-fns'
import { describe, expect, it } from 'vitest'
import { SERVICES } from '../../@types/barber'
import { Appointment, AppointmentStatus } from './appointment'

describe('Appointment entity', () => {
  const validProps = {
    id: 'appointment-1',
    customerId: 'customer-1',
    barberId: 'barber-1',
    service: SERVICES.classic_haircut,
    status: 'PENDING' as AppointmentStatus,
    startAt: addMinutes(new Date(), 10),
    endAt: addMinutes(new Date(), 40),
  }

  it('should create a valid appointment', () => {
    const appointment = new Appointment(validProps)
    expect(appointment).toBeInstanceOf(Appointment)
    expect(appointment.id).toBe(validProps.id)
    expect(appointment.status).toBe(validProps.status)
    expect(appointment.startAt).toBe(validProps.startAt)
    expect(appointment.endAt).toBe(validProps.endAt)
    expect(appointment.service).toBe(validProps.service)
  })

  it('should throw if service is not allowed', () => {
    expect(
      () =>
        new Appointment({
          ...validProps,
          service: 'Invalid Service' as any,
        })
    ).toThrow('Cannot create custom Appointment service.')
  })

  it('should throw if startAt is in the past', () => {
    expect(
      () =>
        new Appointment({
          ...validProps,
          startAt: subMinutes(new Date(), 10),
        })
    ).toThrow('Start date must be in the future.')
  })

  it('should throw if endAt is before startAt', () => {
    expect(
      () =>
        new Appointment({
          ...validProps,
          endAt: addMinutes(validProps.startAt, -5),
        })
    ).toThrow('End date must be after start date.')
  })

  it('should throw if appointment duration is longer than 90 minutes', () => {
    expect(
      () =>
        new Appointment({
          ...validProps,
          endAt: addMinutes(validProps.startAt, 91),
        })
    ).toThrow('Appointment cannot be longer than 1 hour and 30 minutes.')
  })

  describe('cancel method', () => {
    it('should cancel the appointment if there are more than 5 minutes before start', () => {
      const appointment = new Appointment(validProps)
      const canceled = appointment.cancel()

      expect(canceled.status).toBe('CANCELED')
      expect(canceled.id).toBe(appointment.id)
    })

    it('should throw if trying to cancel less than 5 minutes before start', () => {
      const startAtSoon = addMinutes(new Date(), 4)
      const appointment = new Appointment({
        ...validProps,
        startAt: startAtSoon,
        endAt: addMinutes(startAtSoon, 30),
      })

      expect(() => appointment.cancel()).toThrow(
        'Cannot cancel appointment less than 5 minutes before the start time.'
      )
    })
  })

  it('toJSON returns props', () => {
    const appointment = new Appointment(validProps)
    expect(appointment.toJSON()).toEqual(validProps)
  })
})

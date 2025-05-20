import { describe, expect, it } from 'vitest'
import { SERVICES } from '../../@types/service'
import { Appointment } from './appointment'

const futureDate = new Date(Date.now() + 1000 * 60 * 60) // 1h no futuro

describe('Appointment Entity', () => {
  it('creates a valid appointment', () => {
    const appointment = new Appointment({
      customerId: 'customer-1',
      barberId: 'barber-1',
      service: SERVICES.fade_cut,
      status: 'CONFIRMED',
      startAt: futureDate,
    })

    expect(appointment.service).toBe(SERVICES.fade_cut)
    expect(appointment.status).toBe('CONFIRMED')
    expect(appointment.startAt).toEqual(futureDate)
  })

  it('throws if start date is in the past', () => {
    expect(() => {
      new Appointment({
        customerId: 'customer-1',
        barberId: 'barber-1',
        service: SERVICES.fade_cut,
        status: 'CONFIRMED',
        startAt: new Date(Date.now() - 1000),
      })
    }).toThrow('Start date must be in the future.')
  })

  it('throws if service is invalid', () => {
    expect(() => {
      new Appointment({
        customerId: '1',
        barberId: '2',
        service: 'CUSTOM' as any,
        status: 'CONFIRMED',
        startAt: futureDate,
      })
    }).toThrow('Cannot create custom Appointment service.')
  })

  it('cancels appointment with enough time', () => {
    const startAt = new Date(Date.now() + 1000 * 60 * 30)
    const appointment = new Appointment({
      customerId: '1',
      barberId: '2',
      service: SERVICES.fade_cut,
      status: 'CONFIRMED',
      startAt,
    })

    appointment.cancel()
    expect(appointment.status).toBe('CANCELED')
  })

  it('throws if cancel is too close to start', () => {
    const startAt = new Date(Date.now() + 1000 * 60 * 5)
    const appointment = new Appointment({
      customerId: '1',
      barberId: '2',
      service: SERVICES.fade_cut,
      status: 'CONFIRMED',
      startAt,
    })

    expect(() => appointment.cancel()).toThrow(
      'Cannot cancel appointment less than 10 minutes before the start time.'
    )
  })
})

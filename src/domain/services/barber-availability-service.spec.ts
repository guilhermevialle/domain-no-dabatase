import { addMinutes } from 'date-fns'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryAppointmentRepository } from '../../infra/repositories/in-memory/in-memory-appointment-repository'
import { InMemoryAvailableDayRepository } from '../../infra/repositories/in-memory/in-memory-available-day-repository'
import { InMemoryBarberRepository } from '../../infra/repositories/in-memory/in-memory-barber-repository'
import { InMemoryTimeSlotRepository } from '../../infra/repositories/in-memory/in-memory-time-slot-repository'
import { IAppointmentRepository } from '../../interfaces/repositories/appointment-repository'
import { IAvailableDayRepository } from '../../interfaces/repositories/available-day-repository'
import { IBarberRepository } from '../../interfaces/repositories/barber-repository'
import { ITimeSlotRepository } from '../../interfaces/repositories/time-slot-repository'
import { IBarberAvailabilityService } from '../../interfaces/services/barber-availability-service'
import { Appointment } from '../entities/appointment'
import { Barber } from '../entities/barber'
import { BarberAvailabilityService } from './barber-availability-service'

describe('BarberAvailabilityService', () => {
  let barberAvailabilityService: IBarberAvailabilityService
  let barberRepo: IBarberRepository
  let appointmentRepo: IAppointmentRepository
  let availableDayRepo: IAvailableDayRepository
  let timeSlotRepo: ITimeSlotRepository
  let now: Date

  beforeEach(() => {
    now = new Date()
    barberRepo = new InMemoryBarberRepository()
    appointmentRepo = new InMemoryAppointmentRepository()
    availableDayRepo = new InMemoryAvailableDayRepository()
    timeSlotRepo = new InMemoryTimeSlotRepository()

    barberAvailabilityService = new BarberAvailabilityService(
      appointmentRepo,
      availableDayRepo,
      timeSlotRepo
    )
  })

  it('should return true if barber is available', async () => {
    const barber = (await barberRepo.findById('barber-1')) as Barber

    const appointment1 = new Appointment({
      barberId: 'barber-1',
      customerId: 'customer-1',
      service: 'Fade Cut',
      startAt: addMinutes(now, 10),
      duration: 30 + barber.bufferTimeMinutes!,
    })

    const isBarberAvailable = await barberAvailabilityService.isBarberAvailable(
      barber,
      appointment1.startAt,
      appointment1.endAt
    )

    expect(isBarberAvailable).toBe(true)
  })

  it('should return false if barber is not available', async () => {
    const barber = (await barberRepo.findById('barber-1')) as Barber

    const appointment1 = new Appointment({
      barberId: 'barber-1',
      customerId: 'customer-1',
      service: 'Fade Cut',
      startAt: addMinutes(now, 10),
      duration: 30 + barber.bufferTimeMinutes!,
    })

    await appointmentRepo.create(appointment1)

    const isBarberAvailable = await barberAvailabilityService.isBarberAvailable(
      barber,
      appointment1.startAt,
      appointment1.endAt
    )

    expect(isBarberAvailable).toBe(false)
  })
})

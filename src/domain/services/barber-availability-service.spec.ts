import { addMinutes, getDay } from 'date-fns'
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
import { AvailableDay } from '../entities/available-day'
import { Barber } from '../entities/barber'
import { TimeSlot } from '../entities/time-slot'
import { Time } from '../value-objects/time'
import { BarberAvailabilityService } from './barber-availability-service'

describe('BarberAvailabilityService', () => {
  let barberAvailabilityService: IBarberAvailabilityService
  let barberRepo: IBarberRepository
  let appointmentRepo: IAppointmentRepository
  let availableDayRepo: IAvailableDayRepository
  let timeSlotRepo: ITimeSlotRepository
  let now: Date

  beforeEach(async () => {
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

    // Create barber entity
    const barber = new Barber({
      id: 'barber-1',
      fullName: 'John Doe',
      since: new Date('2020-01-01'),
      services: ['Fade Cut'],
      bufferMinutes: 10,
    })
    await barberRepo.create(barber)

    // Create AvailableDay for barber for today weekday
    const availableDay = new AvailableDay({
      id: 'available-day-1',
      barberId: barber.id!,
      weekday: getDay(now),
    })
    await availableDayRepo.create(availableDay)

    // Create TimeSlot for the entire day (so any time slot can fit)
    const timeSlot = new TimeSlot({
      id: 'time-slot-1',
      availableDayId: availableDay.id!,
      start: new Time('00:00'),
      end: new Time('23:59'),
    })
    await timeSlotRepo.create(timeSlot)
  })

  it('should return true if barber is available', async () => {
    const barber = (await barberRepo.findById('barber-1')) as Barber

    const appointment1 = new Appointment({
      barberId: barber.id!,
      customerId: 'customer-1',
      service: 'Fade Cut',
      startAt: addMinutes(now, 10),
      duration: 30 + barber.bufferMinutes!,
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
      barberId: barber.id!,
      customerId: 'customer-1',
      service: 'Fade Cut',
      startAt: addMinutes(now, 10),
      duration: 30 + barber.bufferMinutes!,
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

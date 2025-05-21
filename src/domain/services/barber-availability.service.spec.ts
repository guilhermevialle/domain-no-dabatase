import {addMinutes} from 'date-fns'
import {beforeEach, describe, expect, it} from 'vitest'
import {InMemoryAppointmentRepository} from '../../infra/repositories/in-memory/in-memory-appointment-repository'
import {InMemoryAvailableDayRepository} from '../../infra/repositories/in-memory/in-memory-available-day-repository'
import {InMemoryBarberRepository} from '../../infra/repositories/in-memory/in-memory-barber-repository'
import {InMemoryTimeSlotRepository} from '../../infra/repositories/in-memory/in-memory-time-slot-repository'
import {IAppointmentRepository} from '../../interfaces/repositories/appointment-repository'
import {IAvailableDayRepository} from '../../interfaces/repositories/available-day-repository'
import {IBarberRepository} from '../../interfaces/repositories/barber-repository'
import {ITimeSlotRepository} from '../../interfaces/repositories/time-slot-repository'
import {IBarberAvailabilityService} from '../../interfaces/services/barber-availability-service'
import {Appointment} from '../entities/appointment'
import {AvailableDay} from '../entities/available-day'
import {Barber} from '../entities/barber'
import {TimeSlot} from '../entities/time-slot'
import {Time} from '../value-objects/time'
import {BarberAvailabilityService} from './barber-availability.service'

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
    barberRepo = new InMemoryBarberRepository()
    timeSlotRepo = new InMemoryTimeSlotRepository()

    barberAvailabilityService = new BarberAvailabilityService(
      appointmentRepo,
      availableDayRepo,
      timeSlotRepo,
      barberRepo
    )

    // Create barber
    const barber = new Barber({
      id: 'barber-1',
      fullName: 'John Doe',
      since: new Date('2020-01-01'),
      services: ['Fade Cut'],
      bufferMinutes: 10
    })
    await barberRepo.create(barber)

    // Segunda a sexta (1 = segunda, 5 = sexta)
    for (let weekday = 1; weekday <= 5; weekday++) {
      const availableDay = new AvailableDay({
        id: `available-day-${weekday}`,
        barberId: barber.id!,
        weekday
      })
      await availableDayRepo.create(availableDay)

      // Manhã: 08:00 - 12:00
      const morningSlot = new TimeSlot({
        id: `time-slot-morning-${weekday}`,
        availableDayId: availableDay.id!,
        start: new Time('08:00'),
        end: new Time('12:00')
      })
      await timeSlotRepo.create(morningSlot)

      // Tarde: 13:00 - 17:30
      const afternoonSlot = new TimeSlot({
        id: `time-slot-afternoon-${weekday}`,
        availableDayId: availableDay.id!,
        start: new Time('13:00'),
        end: new Time('17:30')
      })
      await timeSlotRepo.create(afternoonSlot)
    }
  })

  it('should return true if barber is available', async () => {
    const barber = (await barberRepo.findById('barber-1')) as Barber

    const appointment1 = new Appointment({
      barberId: barber.id!,
      customerId: 'customer-1',
      service: 'Fade Cut',
      startAt: addMinutes(now, 10),
      duration: 30 + barber.bufferMinutes!
    })

    const isBarberAvailable = await barberAvailabilityService.isBarberAvailable(
      barber.id!,
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
      duration: 30 + barber.bufferMinutes!
    })

    await appointmentRepo.create(appointment1)

    const isBarberAvailable = await barberAvailabilityService.isBarberAvailable(
      barber.id!,
      appointment1.startAt,
      appointment1.endAt
    )

    expect(isBarberAvailable).toBe(false)
  })
})

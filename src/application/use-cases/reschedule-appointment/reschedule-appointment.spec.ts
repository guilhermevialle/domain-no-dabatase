import { addMinutes, getDay } from 'date-fns'
import { beforeEach, describe, expect, it } from 'vitest'
import { Appointment } from '../../../domain/entities/appointment'
import { AvailableDay } from '../../../domain/entities/available-day'
import { Barber } from '../../../domain/entities/barber'
import { Customer } from '../../../domain/entities/customer'
import { TimeSlot } from '../../../domain/entities/time-slot'
import { BarberAvailabilityService } from '../../../domain/services/barber-availability.service'
import { Email } from '../../../domain/value-objects/email'
import { BrazilPhone } from '../../../domain/value-objects/phone'
import { Time } from '../../../domain/value-objects/time'
import { InMemoryAppointmentRepository } from '../../../infra/repositories/in-memory/in-memory-appointment-repository'
import { InMemoryAvailableDayRepository } from '../../../infra/repositories/in-memory/in-memory-available-day-repository'
import { InMemoryBarberRepository } from '../../../infra/repositories/in-memory/in-memory-barber-repository'
import { InMemoryCustomerRepository } from '../../../infra/repositories/in-memory/in-memory-customer-repository'
import { InMemoryTimeSlotRepository } from '../../../infra/repositories/in-memory/in-memory-time-slot-repository'
import { RescheduleAppointment } from './reschedule-appointment'

describe('RescheduleAppointmentUseCase', () => {
  let appointmentRepo: InMemoryAppointmentRepository
  let availableDayRepo: InMemoryAvailableDayRepository
  let timeSlotRepo: InMemoryTimeSlotRepository
  let barberRepo: InMemoryBarberRepository
  let customerRepo: InMemoryCustomerRepository
  let barberAvailability: BarberAvailabilityService
  let useCase: RescheduleAppointment
  let appointment: Appointment

  beforeEach(async () => {
    appointmentRepo = new InMemoryAppointmentRepository()
    availableDayRepo = new InMemoryAvailableDayRepository()
    timeSlotRepo = new InMemoryTimeSlotRepository()
    barberRepo = new InMemoryBarberRepository()
    customerRepo = new InMemoryCustomerRepository()
    barberAvailability = new BarberAvailabilityService(
      appointmentRepo,
      availableDayRepo,
      timeSlotRepo
    )
    useCase = new RescheduleAppointment(appointmentRepo, barberAvailability)

    await barberRepo.create(
      new Barber({
        id: 'barber-1',
        fullName: 'John Doe',
        since: new Date('2020-01-01'),
        services: ['Beard Trim'],
        bufferMinutes: 10,
      })
    )

    await customerRepo.create(
      new Customer({
        id: 'customer-1',
        fullName: 'Guilherme',
        email: new Email('guivialle@gmail.com'),
        phone: new BrazilPhone('27999999999'),
      })
    )

    const startAt = addMinutes(new Date(), 30)
    const weekday = getDay(startAt)

    await availableDayRepo.create(
      new AvailableDay({
        id: 'available-day-1',
        barberId: 'barber-1',
        weekday,
      })
    )

    await timeSlotRepo.create(
      new TimeSlot({
        availableDayId: 'available-day-1',
        start: new Time('00:00'),
        end: new Time('23:59'),
      })
    )

    appointment = new Appointment({
      barberId: 'barber-1',
      customerId: 'customer-1',
      service: 'Beard Trim',
      startAt,
      endAt: addMinutes(startAt, 30),
    })

    await appointmentRepo.create(appointment)
  })

  it('should reschedule an appointment to a new valid date', async () => {
    const newStart = addMinutes(appointment.startAt, 120)
    const weekday = getDay(newStart)

    await availableDayRepo.create(
      new AvailableDay({
        id: 'available-day-new',
        barberId: 'barber-1',
        weekday,
      })
    )

    await timeSlotRepo.create(
      new TimeSlot({
        availableDayId: 'available-day-new',
        start: new Time('00:00'),
        end: new Time('23:59'),
      })
    )

    const updated = await useCase.execute({
      id: appointment.id!,
      startAt: newStart,
    })

    expect(updated.startAt.getTime()).toBe(newStart.getTime())
  })

  it('should throw if appointment does not exist', async () => {
    await expect(() =>
      useCase.execute({
        id: 'non-existent-id',
        startAt: addMinutes(new Date(), 60),
      })
    ).rejects.toThrow('Appointment not found.')
  })

  it('should throw if trying to reschedule to the same date', async () => {
    await expect(() =>
      useCase.execute({
        id: appointment.id!,
        startAt: appointment.startAt,
      })
    ).rejects.toThrow('Cannot reschedule appointment with the same date.')
  })

  it('should throw if trying to reschedule to a past date', async () => {
    await expect(() =>
      useCase.execute({
        id: appointment.id!,
        startAt: new Date('2000-01-01T00:00:00.000Z'),
      })
    ).rejects.toThrow('Start date must be in the future.')
  })

  it('should throw if barber is not available at the new date', async () => {
    await availableDayRepo.create(
      new AvailableDay({
        id: 'available-day-empty',
        barberId: 'barber-1',
        weekday: 0, // domingo vazio
      })
    )

    const sunday = new Date()
    sunday.setDate(sunday.getDate() + ((7 - sunday.getDay()) % 7)) // próximo domingo
    sunday.setHours(9, 0, 0, 0)

    await expect(() =>
      useCase.execute({
        id: appointment.id!,
        startAt: sunday,
      })
    ).rejects.toThrow('Barber is not available at this time.')
  })
})

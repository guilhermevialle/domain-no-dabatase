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
import { CreateAppointment } from './create-appointment'

describe('CreateAppointmentUseCase', () => {
  let appointmentRepo: InMemoryAppointmentRepository
  let availableDayRepo: InMemoryAvailableDayRepository
  let timeSlotRepo: InMemoryTimeSlotRepository
  let barberRepo: InMemoryBarberRepository
  let customerRepo: InMemoryCustomerRepository
  let barberAvailability: BarberAvailabilityService
  let useCase: CreateAppointment

  beforeEach(() => {
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
    useCase = new CreateAppointment(
      appointmentRepo,
      customerRepo,
      barberRepo,
      barberAvailability
    )
  })

  it('should create an appointment successfully', async () => {
    await barberRepo.create(
      new Barber({
        id: 'barber-5',
        fullName: 'John Doe',
        since: new Date('2020-01-01'),
        services: ['Beard Trim'],
        bufferMinutes: 10,
      })
    )

    const appointmentStart = addMinutes(new Date(), 10)
    const weekday = getDay(appointmentStart)

    await availableDayRepo.create(
      new AvailableDay({
        id: 'available-day-5',
        barberId: 'barber-5',
        weekday: weekday,
      })
    )

    await timeSlotRepo.create(
      new TimeSlot({
        availableDayId: 'available-day-5',
        start: new Time('00:00'),
        end: new Time('23:59'),
      })
    )

    await customerRepo.create(
      new Customer({
        id: 'customer-3',
        fullName: 'Guilherme',
        email: new Email('guivialle@gmail.com'),
        phone: new BrazilPhone('27999999999'),
      })
    )

    await useCase.execute({
      barberId: 'barber-5',
      customerId: 'customer-3',
      service: 'Beard Trim',
      startAt: appointmentStart,
    })
  })

  it('should throw if barber is not available at the requested time.', async () => {
    await barberRepo.create(
      new Barber({
        id: 'barber-2',
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

    await customerRepo.create(
      new Customer({
        id: 'customer-2',
        fullName: 'Guilherme',
        email: new Email('guivialle@gmail.com'),
        phone: new BrazilPhone('27999999999'),
      })
    )

    await appointmentRepo.create(
      new Appointment({
        barberId: 'barber-2',
        customerId: 'customer-1',
        service: 'Beard Trim',
        startAt: addMinutes(new Date(), 10),
        duration: 30,
      })
    )

    await expect(
      useCase.execute({
        barberId: 'barber-2',
        customerId: 'customer-2',
        service: 'Beard Trim',
        startAt: addMinutes(new Date(), 15),
      })
    ).rejects.toThrow('Barber is not available at this time.')
  })

  it('should throw if customer does not exist.', async () => {
    await barberRepo.create(
      new Barber({
        id: 'barber-2',
        fullName: 'John Doe',
        since: new Date('2020-01-01'),
        services: ['Beard Trim'],
        bufferMinutes: 10,
      })
    )

    await expect(
      useCase.execute({
        barberId: 'barber-2',
        customerId: 'non-existent-customer',
        service: 'Beard Trim',
        startAt: addMinutes(new Date(), 10),
      })
    ).rejects.toThrow('Customer not found.')
  })

  it('should throw if barber does not exist.', async () => {
    await customerRepo.create(
      new Customer({
        id: 'customer-1',
        fullName: 'Guilherme',
        email: new Email('guivialle@gmail.com'),
        phone: new BrazilPhone('27999999999'),
      })
    )

    await expect(
      useCase.execute({
        barberId: 'any',
        customerId: 'customer-1',
        service: 'Beard Trim',
        startAt: addMinutes(new Date(), 10),
      })
    ).rejects.toThrow('Barber not found.')
  })
})

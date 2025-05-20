import { addMinutes } from 'date-fns'
import { beforeEach, describe, expect, it } from 'vitest'
import { Appointment } from '../../../domain/entities/appointment'
import { Barber } from '../../../domain/entities/barber'
import { InMemoryAppointmentRepository } from '../../../infra/repositories/in-memory/in-memory-appointment-repository'
import { InMemoryBarberRepository } from '../../../infra/repositories/in-memory/in-memory-barber-repository'
import { IAppointmentRepository } from '../../../interfaces/repositories/appointment-repository'
import { IBarberRepository } from '../../../interfaces/repositories/barber-repository'
import { ListBarberAppointments } from './list-barber-appointments'

describe('ListBarberAppointmentsUseCase', () => {
  let appointmentRepo: IAppointmentRepository
  let barberRepo: IBarberRepository
  let useCase: ListBarberAppointments

  beforeEach(() => {
    appointmentRepo = new InMemoryAppointmentRepository()
    barberRepo = new InMemoryBarberRepository()
    useCase = new ListBarberAppointments(appointmentRepo, barberRepo)
  })

  it('should list barber appointments successfully', async () => {
    await barberRepo.create(
      new Barber({
        id: 'barber-2',
        fullName: 'John Doe',
        services: ['Clean Shave'],
        since: new Date(),
        bufferMinutes: 10,
      })
    )

    await appointmentRepo.create(
      new Appointment({
        barberId: 'barber-2',
        customerId: 'customer-1',
        service: 'Clean Shave',
        startAt: addMinutes(new Date(), 10),
      })
    )

    await appointmentRepo.create(
      new Appointment({
        barberId: 'barber-2',
        customerId: 'customer-2',
        service: 'Clean Shave',
        startAt: addMinutes(new Date(), 10),
      })
    )

    await appointmentRepo.create(
      new Appointment({
        barberId: 'barber-2',
        customerId: 'customer-3',
        service: 'Clean Shave',
        startAt: addMinutes(new Date(), 10),
      })
    )

    const appointments = await useCase.execute({ id: 'barber-2' })

    expect(Array.isArray(appointments)).toBe(true)
    expect(appointments).toHaveLength(3)
    appointments.forEach((appointment) => {
      expect(appointment).toBeInstanceOf(Appointment)
      expect(appointment.barberId).toBe('barber-2')
    })
  })

  it('should throw if barber does not exist', async () => {
    await expect(useCase.execute({ id: 'barber-2' })).rejects.toThrow(
      'Barber not found.'
    )
  })
})

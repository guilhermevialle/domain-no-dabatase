import { addMinutes } from 'date-fns'
import { beforeEach, describe, expect, it } from 'vitest'
import { Appointment } from '../../../domain/entities/appointment'
import { InMemoryAppointmentRepository } from '../../../infra/repositories/in-memory/in-memory-appointment-repository'
import { CancelAppointment } from './cancel-appointment'

let appointmentRepo: InMemoryAppointmentRepository
let useCase: CancelAppointment

describe('CancelAppointmentUseCase', () => {
  beforeEach(() => {
    appointmentRepo = new InMemoryAppointmentRepository()
    useCase = new CancelAppointment(appointmentRepo)
  })

  it('should cancel an appointment successfully', async () => {
    const appointment = new Appointment({
      customerId: 'customer-1',
      barberId: 'barber-1',
      service: 'Kids Haircut',
      startAt: addMinutes(new Date(), 30),
    })

    await appointmentRepo.create(appointment)

    const result = await useCase.execute({
      id: appointment.id!,
    })

    expect(result.status).toBe('CANCELED')
  })

  it('should throw if appointment does not exist', async () => {
    await expect(useCase.execute({ id: 'nonexistent-id' })).rejects.toThrow(
      'Appointment not found.'
    )
  })

  it('should throw if appointment is already canceled', async () => {
    const appointment = new Appointment({
      customerId: 'customer-1',
      barberId: 'barber-1',
      service: 'Kids Haircut',
      startAt: addMinutes(new Date(), 30),
    })

    appointment.cancel()
    await appointmentRepo.create(appointment)

    await expect(useCase.execute({ id: appointment.id! })).rejects.toThrow(
      'Appointment already canceled.'
    )
  })

  it('should throw if appointment is already finished', async () => {
    const appointment = new Appointment({
      customerId: 'customer-1',
      barberId: 'barber-1',
      service: 'Kids Haircut',
      startAt: addMinutes(new Date(), 30),
    })

    appointment.finish()
    await appointmentRepo.create(appointment)

    await expect(useCase.execute({ id: appointment.id! })).rejects.toThrow(
      'Appointment already finished.'
    )
  })

  it('should not cancel an appointment starting in less than 10 minutes', async () => {
    const appointment = new Appointment({
      customerId: 'customer-1',
      barberId: 'barber-1',
      service: 'Kids Haircut',
      startAt: addMinutes(new Date(), 5),
    })

    await appointmentRepo.create(appointment)

    await expect(useCase.execute({ id: appointment.id! })).rejects.toThrow(
      'Cannot cancel appointment less than 10 minutes before the start time.'
    )
  })
})

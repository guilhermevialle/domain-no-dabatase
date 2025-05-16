import { v4 } from 'uuid'
import { describe, expect, it } from 'vitest'
import { Appointment } from '../../../domain/entities/appointment'
import { InMemoryAppointmentRepository } from '../../../infra/repositories/in-memory/in-memory-appointment-repository'
import { CancelAppointment } from './cancel-appointment'

describe('CancelAppointment Use Case', () => {
  it('should cancel a confirmed appointment', async () => {
    const appointmentRepo = new InMemoryAppointmentRepository()
    const cancelAppointment = new CancelAppointment(appointmentRepo)

    const appointment = new Appointment({
      id: v4(),
      customerId: v4(),
      barberId: 'barber1',
      service: 'Clean Shave',
      status: 'CONFIRMED',
      startAt: new Date(Date.now() + 1000 * 60 * 10),
      endAt: new Date(Date.now() + 1000 * 60 * 70),
    })

    await appointmentRepo.create(appointment)

    const canceled = await cancelAppointment.execute({
      appointmentId: appointment.id,
    })

    expect(canceled.status).toBe('CANCELED')
    expect(canceled.id).toBe(appointment.id)

    const fromRepo = await appointmentRepo.findById(appointment.id)
    expect(fromRepo?.status).toBe('CANCELED')
  })

  it('should throw if appointment is not found', async () => {
    const appointmentRepo = new InMemoryAppointmentRepository()
    const cancelAppointment = new CancelAppointment(appointmentRepo)

    await expect(() =>
      cancelAppointment.execute({ appointmentId: v4() })
    ).rejects.toThrow('Appointment not found.')
  })

  it('should throw if appointment is already canceled', async () => {
    const appointmentRepo = new InMemoryAppointmentRepository()
    const cancelAppointment = new CancelAppointment(appointmentRepo)

    const appointment = new Appointment({
      id: v4(),
      customerId: v4(),
      barberId: 'barber1',
      service: 'Fade Cut',
      status: 'CANCELED',
      startAt: new Date(Date.now() + 1000 * 60 * 10),
      endAt: new Date(Date.now() + 1000 * 60 * 70),
    })
    await appointmentRepo.create(appointment)

    await expect(() =>
      cancelAppointment.execute({ appointmentId: appointment.id })
    ).rejects.toThrow('Appointment is already canceled.')
  })
})

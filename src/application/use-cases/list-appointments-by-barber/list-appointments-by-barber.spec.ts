import { describe, expect, it } from 'vitest'
import { SERVICES } from '../../../@types/barber'
import { Appointment } from '../../../domain/entities/appointment'
import { InMemoryAppointmentRepository } from '../../../infra/repositories/in-memory/in-memory-appointment-repository'
import { ListAppointmentsByBarber } from './list-appointments-by-barber'

describe('ListAppointmentsByBarber', () => {
  it('should return only appointments for the given barber', async () => {
    const repo = new InMemoryAppointmentRepository()
    const useCase = new ListAppointmentsByBarber(repo)

    const appointment1 = new Appointment({
      id: '1',
      customerId: 'customer-1',
      barberId: 'barber-1',
      service: SERVICES.fade_cut,
      status: 'CONFIRMED',
      startAt: new Date('2025-05-17T10:00:00'),
      endAt: new Date('2025-05-17T10:30:00'),
    })

    const appointment2 = new Appointment({
      id: '2',
      customerId: 'customer-2',
      barberId: 'barber-2',
      service: SERVICES.classic_haircut,
      status: 'CONFIRMED',
      startAt: new Date('2025-05-17T11:00:00'),
      endAt: new Date('2025-05-17T11:30:00'),
    })

    const appointment3 = new Appointment({
      id: '3',
      customerId: 'customer-3',
      barberId: 'barber-1',
      service: SERVICES.beard_trim,
      status: 'CONFIRMED',
      startAt: new Date('2025-05-18T12:00:00'),
      endAt: new Date('2025-05-18T12:30:00'),
    })

    await repo.create(appointment1)
    await repo.create(appointment2)
    await repo.create(appointment3)

    const result = await useCase.execute({ barberId: 'barber-1' })

    expect(result).toHaveLength(2)
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: '1' }),
        expect.objectContaining({ id: '3' }),
      ])
    )
  })
})

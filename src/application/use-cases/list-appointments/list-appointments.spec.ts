import { addMinutes } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { describe, expect, it } from 'vitest'
import { Appointment } from '../../../domain/entities/appointment'
import { InMemoryAppointmentRepository } from '../../../infra/repositories/in-memory/in-memory-appointment-repository'
import { ListAppointments } from './list-appointments'

describe('ListAppointments', () => {
  it('should return all appointments for a given barber', async () => {
    const repo = new InMemoryAppointmentRepository()
    const useCase = new ListAppointments(repo)

    const barberId = uuidv4()
    const now = new Date()

    const appointment1 = new Appointment({
      id: uuidv4(),
      customerId: uuidv4(),
      barberId: barberId,
      service: 'Modern Haircut',
      status: 'CONFIRMED',
      startAt: addMinutes(now, 10),
      endAt: addMinutes(now, 70),
    })

    const appointment2 = new Appointment({
      id: uuidv4(),
      customerId: uuidv4(),
      barberId: barberId,
      service: 'Scalp Treatment',
      status: 'CONFIRMED',
      startAt: addMinutes(now, 80),
      endAt: addMinutes(now, 140),
    })

    const unrelatedAppointment = new Appointment({
      id: uuidv4(),
      customerId: uuidv4(),
      barberId: 'barber1',
      service: 'Eyebrow Trim',
      status: 'CONFIRMED',
      startAt: addMinutes(now, 150),
      endAt: addMinutes(now, 210),
    })

    await repo.create(appointment1)
    await repo.create(appointment2)
    await repo.create(unrelatedAppointment)

    const result = await useCase.execute({ barberId })

    expect(result).toHaveLength(2)
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: appointment1.id }),
        expect.objectContaining({ id: appointment2.id }),
      ])
    )
  })

  it('should return all appointments for a given customer', async () => {
    const repo = new InMemoryAppointmentRepository()
    const useCase = new ListAppointments(repo)

    const customerId = uuidv4()
    const now = new Date()

    const appointment1 = new Appointment({
      id: uuidv4(),
      customerId,
      barberId: 'barber1',
      service: 'Modern Haircut',
      status: 'CONFIRMED',
      startAt: addMinutes(now, 10),
      endAt: addMinutes(now, 70),
    })

    const appointment2 = new Appointment({
      id: uuidv4(),
      customerId,
      barberId: 'barber1',
      service: 'Scalp Treatment',
      status: 'CONFIRMED',
      startAt: addMinutes(now, 80),
      endAt: addMinutes(now, 140),
    })

    const unrelatedAppointment = new Appointment({
      id: uuidv4(),
      customerId: uuidv4(),
      barberId: 'barber1',
      service: 'Eyebrow Trim',
      status: 'CONFIRMED',
      startAt: addMinutes(now, 150),
      endAt: addMinutes(now, 210),
    })

    await repo.create(appointment1)
    await repo.create(appointment2)
    await repo.create(unrelatedAppointment)

    const result = await useCase.execute({ customerId })

    expect(result).toHaveLength(2)
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: appointment1.id }),
        expect.objectContaining({ id: appointment2.id }),
      ])
    )
  })

  it('should throw if neither customerId nor barberId is provided', async () => {
    const repo = new InMemoryAppointmentRepository()
    const useCase = new ListAppointments(repo)

    // @ts-expect-error: testing invalid input
    await expect(useCase.execute({})).rejects.toThrow(
      'Either customerId or barberId must be provided.'
    )
  })
})

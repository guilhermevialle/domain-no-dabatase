import { beforeEach, describe, expect, it } from 'vitest'
import { Appointment } from '../../../domain/entities/appointment'
import { InMemoryAppointmentRepository } from './in-memory-appointment-repository'

const makeAppointment = (props?: Partial<Appointment>): Appointment =>
  new Appointment({
    id: props?.id ?? 'appt-1',
    customerId: props?.customerId ?? 'cust-1',
    barberId: props?.barberId ?? 'barber-1',
    status: props?.status ?? 'CONFIRMED',
    service: props?.service ?? 'Modern Haircut',
    startAt: props?.startAt ?? new Date('2025-05-20T10:00:00'),
    endAt: props?.endAt ?? new Date('2025-05-20T11:00:00'),
  })

describe('InMemoryAppointmentRepository', () => {
  let repo: InMemoryAppointmentRepository

  beforeEach(() => {
    repo = new InMemoryAppointmentRepository()
  })

  it('should create and retrieve an appointment by ID', async () => {
    const appointment = makeAppointment()
    await repo.create(appointment)

    const found = await repo.findById(appointment.id)
    expect(found).toEqual(appointment)
  })

  it('should return null for non-existent appointment by ID', async () => {
    const found = await repo.findById('non-existent')
    expect(found).toBeNull()
  })

  it('should retrieve all appointments by barber ID', async () => {
    const a1 = makeAppointment({ id: '1', barberId: 'barber-1' })
    const a2 = makeAppointment({ id: '2', barberId: 'barber-2' })
    const a3 = makeAppointment({ id: '3', barberId: 'barber-1' })

    await repo.create(a1)
    await repo.create(a2)
    await repo.create(a3)

    const results = await repo.getAllByBarberId('barber-1')
    expect(results).toHaveLength(2)
    expect(results).toEqual(expect.arrayContaining([a1, a3]))
  })

  it('should retrieve all appointments by customer ID', async () => {
    const a1 = makeAppointment({ id: '1', customerId: 'cust-1' })
    const a2 = makeAppointment({ id: '2', customerId: 'cust-2' })
    const a3 = makeAppointment({ id: '3', customerId: 'cust-1' })

    await repo.create(a1)
    await repo.create(a2)
    await repo.create(a3)

    const results = await repo.getAllByCustomerId('cust-1')
    expect(results).toHaveLength(2)
    expect(results).toEqual(expect.arrayContaining([a1, a3]))
  })

  it('should update an existing appointment', async () => {
    const appointment = makeAppointment()
    await repo.create(appointment)

    const canceledAppointment = appointment.cancel()
    await repo.update(canceledAppointment)

    const updated = await repo.findById(appointment.id)
    expect(updated?.status).toBe('CANCELED')
  })

  it('should throw when trying to update a non-existent appointment', async () => {
    const fakeAppointment = makeAppointment({ id: 'unknown' })
    await expect(repo.update(fakeAppointment)).rejects.toThrow(
      'Appointment not found.'
    )
  })

  describe('findConflictingAppointment', () => {
    it('should find conflicting appointment for the same barber and overlapping time', async () => {
      const existing = makeAppointment()
      await repo.create(existing)

      const conflict = await repo.findConflictingAppointment(
        'barber-1',
        new Date('2025-05-20T10:30:00'),
        new Date('2025-05-20T11:30:00')
      )

      expect(conflict).not.toBeNull()
      expect(conflict?.id).toBe(existing.id)
    })

    it('should not find conflict if barber IDs differ', async () => {
      const existing = makeAppointment({ barberId: 'barber-1' })
      await repo.create(existing)

      const conflict = await repo.findConflictingAppointment(
        'barber-2',
        new Date('2025-05-20T10:30:00'),
        new Date('2025-05-20T11:30:00')
      )

      expect(conflict).toBeNull()
    })

    it('should not find conflict if time does not overlap', async () => {
      const existing = makeAppointment()
      await repo.create(existing)

      const conflict = await repo.findConflictingAppointment(
        'barber-1',
        new Date('2025-05-20T11:00:01'),
        new Date('2025-05-20T12:00:00')
      )

      expect(conflict).toBeNull()
    })

    it('should ignore appointments with status CANCELED', async () => {
      const existing = makeAppointment({ status: 'CANCELED' })
      await repo.create(existing)

      const conflict = await repo.findConflictingAppointment(
        'barber-1',
        new Date('2025-05-20T10:00:00'),
        new Date('2025-05-20T11:00:00')
      )

      expect(conflict).toBeNull()
    })
  })
})

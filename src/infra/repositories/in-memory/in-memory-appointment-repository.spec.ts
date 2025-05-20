import { addMinutes } from 'date-fns'
import { beforeEach, describe, expect, it } from 'vitest'
import { SERVICES_DURATION } from '../../../@types/service'
import { AppointmentProps } from '../../../domain/entities/appointment'
import { Barber } from '../../../domain/entities/barber'
import { IAppointmentRepository } from '../../../interfaces/repositories/appointment-repository'
import { Appointment } from './../../../domain/entities/appointment'
import { InMemoryAppointmentRepository } from './in-memory-appointment-repository'

describe('InMemoryAppointmentRepository', () => {
  let inMemoryAppointmentRepository: IAppointmentRepository
  const appointmentProps: AppointmentProps = {
    barberId: 'barber-id',
    customerId: 'customer-id',
    startAt: addMinutes(new Date(), 30),
    service: 'Beard Trim',
    duration: 30,
  }

  beforeEach(() => {
    inMemoryAppointmentRepository = new InMemoryAppointmentRepository()
  })

  it('should create an appointment', async () => {
    const appointment = new Appointment(appointmentProps)

    await inMemoryAppointmentRepository.create(appointment)

    const foundAppointment = await inMemoryAppointmentRepository.findById(
      appointment.id!
    )

    expect(foundAppointment).toEqual(appointment)
    expect(foundAppointment?.barberId).toEqual(appointment.barberId)
    expect(foundAppointment?.customerId).toEqual(appointment.customerId)
    expect(foundAppointment?.startAt).toEqual(appointment.startAt)
    expect(foundAppointment?.service).toEqual(appointment.service)
    expect(foundAppointment?.estimatedDurationMinutes).toEqual(
      appointment.estimatedDurationMinutes
    )
    expect(foundAppointment?.id).toEqual(appointment.id)
    expect(foundAppointment?.createdAt).toEqual(appointment.createdAt)
    expect(foundAppointment?.updatedAt).toEqual(appointment.updatedAt)
  })

  it('should update an appointment', async () => {
    const appointment = new Appointment(appointmentProps)

    await inMemoryAppointmentRepository.create(appointment)

    const updatedAppointment = new Appointment({
      ...appointment.toJSON(),
      service: 'Fade Cut',
    })

    await inMemoryAppointmentRepository.update(updatedAppointment)
    const foundAppointment = await inMemoryAppointmentRepository.findById(
      appointment.id!
    )

    expect(foundAppointment).toEqual(updatedAppointment)
    expect(foundAppointment?.barberId).toEqual(updatedAppointment.barberId)
    expect(foundAppointment?.customerId).toEqual(updatedAppointment.customerId)
    expect(foundAppointment?.startAt).toEqual(updatedAppointment.startAt)
    expect(foundAppointment?.service).toEqual(updatedAppointment.service)
    expect(foundAppointment?.estimatedDurationMinutes).toEqual(
      updatedAppointment.estimatedDurationMinutes
    )
    expect(foundAppointment?.id).toEqual(updatedAppointment.id)
    expect(foundAppointment?.createdAt).toEqual(updatedAppointment.createdAt)
    expect(foundAppointment?.updatedAt).toEqual(updatedAppointment.updatedAt)
  })

  it('should find an appointment by ID', async () => {
    const appointment = new Appointment(appointmentProps)

    inMemoryAppointmentRepository.create(appointment)

    const foundAppointment = await inMemoryAppointmentRepository.findById(
      appointment.id!
    )

    expect(foundAppointment).toEqual(appointment)
  })

  it('should find appointments by barber ID', async () => {})

  it('should find appointments by customer ID', () => {
    // Test implementation
  })

  it('should check for overlapping appointments by date and barber ID', async () => {
    const barber = new Barber({
      fullName: 'John Doe',
      since: new Date(),
      services: ['Beard Trim'],
      bufferTimeMinutes: 5,
    })

    const now = new Date()

    const appointment1 = new Appointment({
      barberId: barber.id!,
      customerId: 'customer-id-1',
      startAt: addMinutes(now, 30),
      service: 'Beard Trim',
      duration: SERVICES_DURATION['Beard Trim'] + barber.bufferTimeMinutes!,
    })

    console.log(appointment1.toJSON())

    const appointment2 = new Appointment({
      barberId: barber.id!,
      customerId: 'customer-id-2',
      startAt: addMinutes(now, 20),
      service: 'Beard Trim',
    })

    await inMemoryAppointmentRepository.create(appointment1)

    const isOverlapping =
      await inMemoryAppointmentRepository.isOverlappingByDateAndBarberId(
        barber.id!,
        appointment2.startAt,
        appointment2.endAt
      )

    expect(isOverlapping).toBe(true)
  })
})

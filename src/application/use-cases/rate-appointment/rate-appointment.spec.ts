import { addMinutes } from 'date-fns'
import { beforeEach, describe, expect, it } from 'vitest'
import { Appointment } from '../../../domain/entities/appointment'
import { Rating } from '../../../domain/entities/rating'
import { InMemoryAppointmentRepository } from '../../../infra/repositories/in-memory/in-memory-appointment-repository'
import { InMemoryRatingRepository } from '../../../infra/repositories/in-memory/in-memory-rating-repository'
import { RateAppointment } from './rate-appointment'

describe('RateAppointment Use Case', () => {
  let rateAppointment: RateAppointment
  let appointmentRepo: InMemoryAppointmentRepository
  let ratingRepo: InMemoryRatingRepository

  beforeEach(() => {
    appointmentRepo = new InMemoryAppointmentRepository()
    ratingRepo = new InMemoryRatingRepository()
    rateAppointment = new RateAppointment(ratingRepo, appointmentRepo)
  })

  it('should create a rating for an existing appointment', async () => {
    // Arrange: create and save an appointment first
    const appointment = new Appointment({
      id: 'appointment-1',
      barberId: 'barber-1',
      customerId: 'customer-1',
      service: 'Kids Haircut',
      startAt: addMinutes(new Date(), 30),
      duration: 60,
    })
    await appointmentRepo.create(appointment)

    // Act
    const rating = await rateAppointment.execute({
      appointmentId: appointment.id!,
      barberId: appointment.barberId,
      customerId: appointment.customerId,
      rating: 5,
    })

    // Assert
    expect(rating).toBeInstanceOf(Rating)
    expect(rating.appointmentId).toBe(appointment.id)
    expect(rating.rating).toBe(5)

    // Also confirm it was saved in the repo
    const storedRating = await ratingRepo.findByAppointmentId(appointment.id!)
    expect(storedRating).not.toBeNull()
    expect(storedRating?.rating).toBe(5)
  })

  it('should throw if appointment does not exist', async () => {
    await expect(() =>
      rateAppointment.execute({
        appointmentId: 'non-existing',
        barberId: 'barber-1',
        customerId: 'customer-1',
        rating: 4,
      })
    ).rejects.toThrow('Appointment not found.')
  })

  it('should throw if barberId mismatches', async () => {
    const appointment = new Appointment({
      id: 'appointment-2',
      barberId: 'barber-1',
      customerId: 'customer-1',
      service: 'Kids Haircut',
      startAt: addMinutes(new Date(), 30),
      duration: 60,
    })
    await appointmentRepo.create(appointment)

    await expect(() =>
      rateAppointment.execute({
        appointmentId: appointment.id!,
        barberId: 'wrong-barber',
        customerId: appointment.customerId,
        rating: 4,
      })
    ).rejects.toThrow('Barber mismatch.')
  })

  it('should throw if customerId mismatches', async () => {
    const appointment = new Appointment({
      id: 'appointment-3',
      barberId: 'barber-1',
      customerId: 'customer-1',
      service: 'Kids Haircut',
      startAt: addMinutes(new Date(), 30),
      duration: 60,
    })
    await appointmentRepo.create(appointment)

    await expect(() =>
      rateAppointment.execute({
        appointmentId: appointment.id!,
        barberId: appointment.barberId,
        customerId: 'wrong-customer',
        rating: 4,
      })
    ).rejects.toThrow('Customer mismatch.')
  })

  it('should throw if appointment already rated', async () => {
    const appointment = new Appointment({
      id: 'appointment-4',
      barberId: 'barber-1',
      customerId: 'customer-1',
      service: 'Kids Haircut',
      startAt: addMinutes(new Date(), 30),
      duration: 60,
    })
    await appointmentRepo.create(appointment)

    const rating = new Rating({
      appointmentId: appointment.id!,
      barberId: appointment.barberId,
      customerId: appointment.customerId,
      rating: 4,
    })
    await ratingRepo.create(rating)

    await expect(() =>
      rateAppointment.execute({
        appointmentId: appointment.id!,
        barberId: appointment.barberId,
        customerId: appointment.customerId,
        rating: 5,
      })
    ).rejects.toThrow('Appointment already rated.')
  })
})

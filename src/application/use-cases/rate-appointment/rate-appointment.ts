import { Rating, RequiredRatingProps } from '../../../domain/entities/rating'
import { IAppointmentRepository } from '../../../interfaces/repositories/appointment-repository'
import { IRatingRepository } from '../../../interfaces/repositories/rating-repository'

type RateAppointmentRequest = RequiredRatingProps & {}

type RateAppointmentResponse = Rating

export class RateAppointment {
  constructor(
    private ratingRepo: IRatingRepository,
    private appointmentRepo: IAppointmentRepository
  ) {}

  async execute({
    appointmentId,
    barberId,
    customerId,
    rating: ratingValue,
  }: RateAppointmentRequest): Promise<RateAppointmentResponse> {
    const appointment = await this.appointmentRepo.findById(appointmentId)
    if (!appointment) throw new Error('Appointment not found.')

    if (appointment.barberId !== barberId) throw new Error('Barber mismatch.')
    if (appointment.customerId !== customerId)
      throw new Error('Customer mismatch.')

    const existingRating =
      await this.ratingRepo.findByAppointmentId(appointmentId)
    if (existingRating) throw new Error('Appointment already rated.')

    const rating = new Rating({
      appointmentId,
      barberId,
      customerId,
      rating: ratingValue,
    })

    await this.ratingRepo.create(rating)

    return rating
  }
}

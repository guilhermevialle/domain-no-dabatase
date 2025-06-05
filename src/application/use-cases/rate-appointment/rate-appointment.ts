import { Rating, RequiredRatingProps } from '../../../domain/entities/rating';
import { IAppointmentRepository } from '../../../interfaces/repositories/appointment-repository.interface';
import { IRatingRepository } from '../../../interfaces/repositories/rating-repository.interface';
import {
  AppointmentAlreadyRatedError,
  AppointmentMismatchError,
  AppointmentNotFoundError,
} from '../../errors/shared';

type RateAppointmentRequest = RequiredRatingProps;

type RateAppointmentResponse = Rating;

export class RateAppointment {
  constructor(
    private ratingRepo: IRatingRepository,
    private appointmentRepo: IAppointmentRepository,
  ) {}

  async execute({
    appointmentId,
    barberId,
    comment,
    customerId,
    rating,
  }: RateAppointmentRequest): Promise<RateAppointmentResponse> {
    const appointment = await this.appointmentRepo.findById(appointmentId);

    if (!appointment) throw new AppointmentNotFoundError();

    if (appointment.barberId !== barberId)
      throw new AppointmentMismatchError('Barber mismatch with appointment.');

    if (appointment.customerId !== customerId)
      throw new AppointmentMismatchError('Customer mismatch with appointment.');

    const foundRating =
      await this.ratingRepo.findByAppointmentId(appointmentId);

    if (foundRating) throw new AppointmentAlreadyRatedError();

    const _rating = Rating.create({
      appointmentId,
      barberId,
      customerId,
      comment,
      rating,
    });

    await this.ratingRepo.create(_rating);

    return _rating;
  }
}

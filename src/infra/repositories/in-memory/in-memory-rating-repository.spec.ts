import { beforeEach, describe, expect, it } from 'vitest';
import { Rating } from '../../../domain/entities/rating';
import { IRatingRepository } from '../../../interfaces/repositories/rating-repository';
import { InMemoryRatingRepository } from './in-memory-rating-repository';

describe('InMemory Rating Repository', () => {
  let ratingRepo: IRatingRepository;
  let rating: Rating;

  beforeEach(() => {
    ratingRepo = new InMemoryRatingRepository();
    rating = new Rating({
      appointmentId: 'a-1',
      barberId: 'b-1',
      customerId: 'c-1',
      comment: 'Great service!',
      rating: 5,
    });
  });

  it('should store a new rating', async () => {
    await ratingRepo.create(rating);

    const ratingFound = await ratingRepo.findById(rating.id!);

    expect(ratingFound).toEqual(rating);
  });

  it('should return a rating by id if it exists', async () => {
    await ratingRepo.create(rating);

    const ratingFound = await ratingRepo.findById(rating.id!);

    expect(ratingFound).toEqual(rating);
  });

  it('should return null if no rating exists with the given id', async () => {
    const ratingFound = await ratingRepo.findById('non-existing-id');
    expect(ratingFound).toBeNull();
  });

  it('should return a rating by appointmentId if it exists', async () => {
    await ratingRepo.create(rating);

    const ratingFound = await ratingRepo.findByAppointmentId(
      rating.appointmentId,
    );

    expect(ratingFound).toEqual(rating);
  });

  it('should return null if no rating exists for the given appointmentId', async () => {
    const ratingFound = await ratingRepo.findByAppointmentId('non-existing-id');
    expect(ratingFound).toBeNull();
  });

  it('should return all ratings for a given barberId', async () => {
    await ratingRepo.create(rating);

    const ratingsFound = await ratingRepo.findByBarberId(rating.barberId);

    expect(ratingsFound).toEqual([rating]);
  });

  it('should return an empty array if no ratings exist for the given barberId', async () => {
    const ratingsFound = await ratingRepo.findByBarberId('non-existing-id');
    expect(ratingsFound).toEqual([]);
  });

  it('should return all ratings for a given customerId', async () => {
    await ratingRepo.create(rating);

    const ratingsFound = await ratingRepo.findByCustomerId(rating.customerId);

    expect(ratingsFound).toEqual([rating]);
  });

  it('should return an empty array if no ratings exist for the given customerId', async () => {
    const ratingsFound = await ratingRepo.findByCustomerId('non-existing-id');
    expect(ratingsFound).toEqual([]);
  });
});

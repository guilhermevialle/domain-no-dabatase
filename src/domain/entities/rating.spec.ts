import { beforeEach, describe, expect, it } from 'vitest';
import { Rating } from './rating';

describe('Rating Entity', () => {
  let rating: Rating;

  beforeEach(() => {
    rating = new Rating({
      appointmentId: 'a-1',
      barberId: 'b-1',
      customerId: 'c-1',
      comment: 'Great service!',
      rating: 5,
    });
  });

  it('should create a rating with default id, comment, and createdAt', () => {
    expect(rating.id).toBeDefined();
    expect(rating.comment).toBeDefined();
    expect(rating.createdAt).toBeDefined();
  });

  it('should throw if rating is less than 1', () => {
    expect(() => {
      new Rating({
        ...rating.toJSON(),
        rating: 0,
      });
    }).toThrow();
  });

  it('should throw if rating is greater than 5', () => {
    expect(() => {
      new Rating({
        ...rating.toJSON(),
        rating: 6,
      });
    }).toThrow();
  });

  it('should throw if comment exceeds 255 characters', () => {
    expect(() => {
      new Rating({
        ...rating.toJSON(),
        comment: 'a'.repeat(256),
      });
    }).toThrow();
  });

  it('should preserve provided id, comment, and createdAt if given', () => {
    const id = 'a-1';
    const comment = 'Great service!';
    const createdAt = new Date();

    const iRating = new Rating({
      ...rating.toJSON(),
      id,
      comment,
      createdAt,
    });

    expect(iRating.id).toBe(id);
    expect(iRating.comment).toBe(comment);
    expect(iRating.createdAt).toBe(createdAt);
  });
});

import { DomainError } from './domain.error';

export abstract class RatingErrors extends DomainError {}

export class CommentSizeError extends RatingErrors {
  constructor(message?: string) {
    super(message ?? 'Comment must be under 255 characters.');
  }
}

export class RatingValueError extends RatingErrors {
  constructor(message?: string) {
    super(message ?? 'Rating must be between 1 and 5.');
  }
}

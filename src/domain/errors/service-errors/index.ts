import { DomainError } from '../domain-error';

export abstract class ServiceError extends DomainError {}

export class InvalidPriceError extends ServiceError {
  constructor(message?: string) {
    super(message ?? 'Invalid price.');
  }
}

export class InvalidDurationError extends ServiceError {
  constructor(message?: string) {
    super(message ?? 'Invalid duration.');
  }
}

import { DomainError } from '../domain-error';

export class PastDateError extends DomainError {
  constructor(message?: string) {
    super(message ?? 'Date must be in the future.');
  }
}

export class FutureDateError extends DomainError {
  constructor(message?: string) {
    super(message ?? 'Date must be in the past.');
  }
}

export class SameDateError extends DomainError {
  constructor(message?: string) {
    super(message ?? 'Date must be different from the another one.');
  }
}

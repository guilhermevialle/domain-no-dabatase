import { DomainError } from '../domain-error';

export class PastDateError extends DomainError {
  constructor(message?: string) {
    super(message ?? 'Date must be in the future.');
  }
}

new PastDateError();

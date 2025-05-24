import { DomainError } from '../domain-error';

export abstract class BarberError extends DomainError {}

export class DuplicateServiceError extends BarberError {
  constructor(message?: string) {
    super(message ?? 'Cannot have duplicate service.');
  }
}

export class EmptyServicesError extends BarberError {
  constructor(message?: string) {
    super(message ?? 'Must have at least one service.');
  }
}

import { DomainError } from '../domain-error';

export abstract class BarberError extends DomainError {}

export class DuplicateServiceError extends BarberError {
  constructor(message?: string) {
    super(message ?? 'Cannot have duplicate service.');
  }
}

export class DuplicateAvailableDayError extends BarberError {
  constructor(message?: string) {
    super(message ?? 'Cannot have duplicate available day.');
  }
}

export class DuplicateTimeSlotError extends BarberError {
  constructor(message?: string) {
    super(message ?? 'Cannot have duplicate time slot.');
  }
}

export class EmptyServicesError extends BarberError {
  constructor(message?: string) {
    super(message ?? 'Must have at least one service.');
  }
}

export class MissingAvailableDayError extends BarberError {
  constructor(message?: string) {
    super(message ?? 'Must have at least one available day.');
  }
}

export class MissingTimeSlotError extends BarberError {
  constructor(message?: string) {
    super(message ?? 'Must have at least one time slot.');
  }
}

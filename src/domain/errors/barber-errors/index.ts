import { DomainError } from '../domain-error';

export abstract class BarberError extends DomainError {}

export class DuplicateServiceError extends BarberError {
  constructor(message?: string) {
    super(message ?? 'Cannot have duplicate service.');
  }
}

export class DuplicateWorkDayError extends BarberError {
  constructor(message?: string) {
    super(message ?? 'Cannot have duplicate work day.');
  }
}

export class DuplicateShiftError extends BarberError {
  constructor(message?: string) {
    super(message ?? 'Cannot have duplicate time slot.');
  }
}

export class EmptyServicesError extends BarberError {
  constructor(message?: string) {
    super(message ?? 'Must have at least one service.');
  }
}

export class MissingWorkDayError extends BarberError {
  constructor(message?: string) {
    super(message ?? 'Must have at least one work day.');
  }
}

export class MissingTimeSlotError extends BarberError {
  constructor(message?: string) {
    super(message ?? 'Must have at least one time slot.');
  }
}

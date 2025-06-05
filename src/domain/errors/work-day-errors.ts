import { DomainError } from './domain.error';

export abstract class AvailableDayError extends DomainError {}

export class InvalidWeekdayError extends AvailableDayError {
  constructor(message?: string) {
    super(message ?? 'Weekday must be between 0 (Sunday) and 6 (Saturday).');
  }
}

export class MissingShiftError extends AvailableDayError {
  constructor(message?: string) {
    super(message ?? 'Day must have at least one shift.');
  }
}

export class DuplicateShiftError extends AvailableDayError {
  constructor(message?: string) {
    super(message ?? 'Day cannot have duplicate shifts.');
  }
}

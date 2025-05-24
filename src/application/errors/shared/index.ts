import { ApplicationError } from '../application-error';

export class AppointmentNotFoundError extends ApplicationError {
  constructor(message?: string) {
    super(message ?? 'Appointment not found.');
  }
}

export class CustomerNotFoundError extends ApplicationError {
  constructor(message?: string) {
    super(message ?? 'Customer not found.');
  }
}

export class BarberNotFoundError extends ApplicationError {
  constructor(message?: string) {
    super(message ?? 'Barber not found.');
  }
}

export class BarberNotAvailableError extends ApplicationError {
  constructor(message?: string) {
    super(message ?? 'Barber not available.');
  }
}

export class BarberDoesNotProvideServiceError extends ApplicationError {
  constructor(message?: string) {
    super(message ?? 'Barber does not provide this service.');
  }
}

export class AppointmentMismatchError extends ApplicationError {
  constructor(message?: string) {
    super(message ?? 'Appointment mismatch.');
  }
}

export class AppointmentAlreadyRatedError extends ApplicationError {
  constructor(message?: string) {
    super(message ?? 'Appointment already rated.');
  }
}

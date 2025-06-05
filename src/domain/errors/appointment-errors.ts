import { DomainError } from './domain.error';

export abstract class AppointmentError extends DomainError {}

export class AppointmentAlreadyScheduledError extends AppointmentError {
  constructor(message?: string) {
    super(message ?? 'Appointment already scheduled.');
  }
}

export class AppointmentNotScheduledError extends AppointmentError {
  constructor(message?: string) {
    super(message ?? 'Appointment not yet scheduled.');
  }
}

// domain/appointment/errors/already-canceled-error.ts
export class AppointmentAlreadyCanceledError extends AppointmentError {
  constructor(message?: string) {
    super(message ?? 'Appointment already canceled.');
  }
}

// domain/appointment/errors/already-expired-error.ts
export class AppointmentAlreadyExpiredError extends AppointmentError {
  constructor(message?: string) {
    super(message ?? 'Appointment already expired.');
  }
}

// domain/appointment/errors/already-finished-error.ts
export class AppointmentAlreadyFinishedError extends AppointmentError {
  constructor(message?: string) {
    super(message ?? 'Appointment already finished.');
  }
}

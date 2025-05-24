import { addMinutes, differenceInMinutes, getDay, isPast } from 'date-fns';
import { AppointmentStatus } from '../../@types/appointment';
import { AvailableService } from '../../@types/service';
import { randomId } from '../../utils/random-id';
import {
  AppointmentAlreadyCanceledError,
  AppointmentAlreadyExpiredError,
  AppointmentAlreadyFinishedError,
  AppointmentAlreadyScheduledError,
  AppointmentNotScheduledError,
} from '../errors/appointment-errors';
import { PastDateError } from '../errors/shared/date-in-past';
import { Time } from '../value-objects/time';

type OptionalAppointmentProps = Partial<{
  id: string;
  status: AppointmentStatus;
  endAt: Date;
  updatedAt: Date;
  createdAt: Date;
}>;

interface RequiredAppointmentProps {
  customerId: string;
  barberId: string;
  service: AvailableService;
  startAt: Date;
  priceInCents: number;
  duration: number;
}

export type AppointmentProps = RequiredAppointmentProps &
  OptionalAppointmentProps;

export class Appointment {
  private events: string[] = [];
  private props: AppointmentProps;

  private constructor(props: AppointmentProps) {
    const now = new Date();

    this.props = {
      ...props,
      id: props.id ?? randomId(),
      status: props.status ?? 'PENDING',
      duration: props.duration ?? 30,
      endAt: props.endAt ?? addMinutes(props.startAt, props.duration!),
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    };

    this.validate(this.props);
  }

  static create(props: RequiredAppointmentProps) {
    return new Appointment(props);
  }

  static restore(props: Required<AppointmentProps>) {
    return new Appointment(props);
  }

  private validate(props: AppointmentProps) {
    if (props.duration! % 30 !== 0) {
      throw new Error('Duration must be a multiple of 30 minutes.');
    }

    if (isPast(props.startAt)) throw new PastDateError();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  public finish() {
    if (this.props.status === 'PENDING')
      throw new AppointmentNotScheduledError();

    if (this.props.status === 'CANCELED')
      throw new AppointmentAlreadyCanceledError();

    if (this.props.status === 'EXPIRED')
      throw new AppointmentAlreadyExpiredError();

    if (this.props.status === 'FINISHED')
      throw new AppointmentAlreadyFinishedError();

    this.props.status = 'FINISHED';
    this.touch();

    this.events.push('appointment.finished');
  }

  public expire() {
    if (this.props.status === 'PENDING')
      throw new AppointmentNotScheduledError();

    if (this.props.status === 'CANCELED')
      throw new AppointmentAlreadyCanceledError();

    if (this.props.status === 'EXPIRED')
      throw new AppointmentAlreadyExpiredError();

    if (this.props.status === 'FINISHED')
      throw new AppointmentAlreadyFinishedError();

    this.props.status = 'EXPIRED';
    this.touch();

    this.events.push('appointment.expired');
  }

  public schedule() {
    if (this.props.status === 'SCHEDULED')
      throw new AppointmentAlreadyScheduledError();

    if (this.props.status === 'CANCELED')
      throw new AppointmentAlreadyCanceledError();

    if (this.props.status === 'EXPIRED')
      throw new AppointmentAlreadyExpiredError();

    if (this.props.status === 'FINISHED')
      throw new AppointmentAlreadyFinishedError();

    this.props.status = 'SCHEDULED';
    this.touch();

    this.events.push('appointment.scheduled');
  }

  public cancel() {
    if (this.props.status === 'PENDING')
      throw new AppointmentNotScheduledError();

    if (this.props.status === 'CANCELED')
      throw new AppointmentAlreadyCanceledError();

    if (this.props.status === 'EXPIRED')
      throw new AppointmentAlreadyExpiredError();

    if (this.props.status === 'FINISHED')
      throw new AppointmentAlreadyFinishedError();

    const now = new Date();
    const minutesUntilStart = differenceInMinutes(this.props.startAt, now);

    if (minutesUntilStart < 10)
      throw new Error(
        'Cannot cancel appointment less than 10 minutes before the start time.',
      );

    this.props.status = 'CANCELED';
    this.touch();
    this.events.push('appointment.canceled');
  }

  public reschedule(date: Date) {
    if (this.props.status === 'PENDING')
      throw new AppointmentNotScheduledError();

    if (this.props.status === 'CANCELED')
      throw new AppointmentAlreadyCanceledError();

    if (this.props.status === 'EXPIRED')
      throw new AppointmentAlreadyExpiredError();

    if (this.props.status === 'FINISHED')
      throw new AppointmentAlreadyFinishedError();

    const now = new Date();

    if (isPast(date)) throw new PastDateError();

    const minutesUntilStart = differenceInMinutes(date, now);

    if (minutesUntilStart < 10)
      throw new Error(
        'Cannot reschedule appointment less than 10 minutes before the start time.',
      );

    this.props.startAt = date;
    this.props.endAt = addMinutes(date, this.props.duration!);
    this.touch();

    this.events.push('appointment.rescheduled');
  }

  public pullEvents(): string[] {
    const events = [...this.events];
    this.events = [];
    return events;
  }

  public getTime() {
    return Time.create(this.startAt);
  }

  public getDay() {
    return getDay(this.props.startAt);
  }

  public toJSON() {
    return this.props as Required<AppointmentProps>;
  }

  // getters
  get id() {
    return this.props.id!;
  }

  get customerId() {
    return this.props.customerId;
  }

  get barberId() {
    return this.props.barberId;
  }

  get service() {
    return this.props.service;
  }

  get status() {
    return this.props.status!;
  }

  get priceInCents() {
    return this.props.priceInCents;
  }

  get startAt() {
    return this.props.startAt;
  }

  get duration() {
    return this.props.duration;
  }

  get endAt() {
    return addMinutes(this.props.startAt, this.props.duration!);
  }

  get createdAt() {
    return this.props.createdAt!;
  }

  get updatedAt() {
    return this.props.updatedAt!;
  }
}

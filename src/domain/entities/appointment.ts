import { addMinutes, differenceInMinutes, getDay, isPast } from 'date-fns';
import { AppointmentStatus } from '../../@types/appointment';
import { AvailableService } from '../../@types/service';
import { randomId } from '../../utils/random-id';
import { Time } from '../value-objects/time';

type OptionalAppointmentProps = Partial<{
  id: string;
  status: AppointmentStatus;
  duration: number;
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
}

export type AppointmentProps = RequiredAppointmentProps &
  OptionalAppointmentProps;

export class Appointment {
  private props: AppointmentProps;

  constructor(props: AppointmentProps) {
    const now = new Date();

    this.props = {
      ...props,
      id: props.id ?? randomId(),
      status: props.status ?? 'SCHEDULED',
      duration: props.duration ?? 30,
      endAt: props.endAt ?? addMinutes(props.startAt, props.duration!),
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    };

    this.validate(this.props);
  }

  private validate(props: AppointmentProps) {
    if (props.duration! % 30 !== 0) {
      throw new Error('Duration must be a multiple of 30 minutes.');
    }

    if (isPast(props.startAt))
      throw new Error('Start date must be in the future.');
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  public finish() {
    this.props.status = 'FINISHED';
    this.touch();
  }

  public discard() {
    this.props.status = 'EXPIRED';
    this.touch();
  }

  public cancel() {
    const now = new Date();
    const minutesUntilStart = differenceInMinutes(this.props.startAt, now);

    if (minutesUntilStart < 10)
      throw new Error(
        'Cannot cancel appointment less than 10 minutes before the start time.',
      );

    this.props.status = 'CANCELED';
    this.touch();
  }

  public reschedule(startAt: Date) {
    if (isPast(startAt)) throw new Error('Start date must be in the future.');

    const minutesUntilStart = differenceInMinutes(startAt, new Date());

    if (minutesUntilStart < 10)
      throw new Error(
        'Cannot reschedule appointment less than 10 minutes before the start time.',
      );

    this.props.startAt = startAt;
    this.props.endAt = addMinutes(startAt, this.props.duration!);
    this.touch();
  }

  public getTime() {
    return new Time(this.startAt);
  }

  public getDay() {
    return getDay(this.props.startAt);
  }

  public toJSON() {
    return this.props;
  }

  // getters
  get id() {
    return this.props.id;
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
    return this.props.status;
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
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}

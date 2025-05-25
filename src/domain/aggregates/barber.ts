import { AvailableService } from '../../@types/service';
import { buildAvailability } from '../../test/builders/build-barber-availability';
import { randomId } from '../../utils/random-id';
import { AvailableDay } from '../entities/available-day';
import { TimeSlot } from '../entities/time-slot';
import {
  DuplicateAvailableDayError,
  DuplicateServiceError,
  DuplicateTimeSlotError,
  EmptyServicesError,
  MissingAvailableDayError,
  MissingTimeSlotError,
} from '../errors/barber-errors';

type OptionalBarberProps = Partial<{
  id: string;
  createdAt: Date;
  updatedAt: Date;
}>;

interface RequiredBarberProps {
  fullName: string;
  services: AvailableService[];
  availableDays: AvailableDay[];
  timeSlots: TimeSlot[];
}

type BarberProps = RequiredBarberProps & OptionalBarberProps;

export class Barber {
  private props: BarberProps;
  private servicesSet: Set<AvailableService>;
  private availableDaysSet: Set<AvailableDay>;
  private timeSlotsSet: Set<TimeSlot>;
  private events: string[] = [];

  private constructor(props: BarberProps) {
    this.props = {
      ...props,
      id: props.id || randomId(),
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };

    this.servicesSet = new Set(this.props.services);
    this.availableDaysSet = new Set(this.props.availableDays);
    this.timeSlotsSet = new Set(this.props.timeSlots);

    this.validate();
  }

  private validate() {
    if (this.servicesSet.size < 1) throw new EmptyServicesError();
    if (this.servicesSet.size !== this.props.services.length)
      throw new DuplicateServiceError();

    if (this.availableDaysSet.size < 1) throw new MissingAvailableDayError();
    if (this.availableDaysSet.size !== this.props.availableDays.length)
      throw new DuplicateAvailableDayError();

    if (this.timeSlotsSet.size < 1) throw new MissingTimeSlotError();
    if (this.timeSlotsSet.size !== this.props.timeSlots.length)
      throw new DuplicateTimeSlotError();
  }

  static create(props: RequiredBarberProps) {
    return new Barber(props);
  }

  static restore(props: Required<BarberProps>) {
    return new Barber(props);
  }

  public offersService(service: AvailableService) {
    return this.servicesSet.has(service);
  }

  public addService(service: AvailableService) {
    if (this.servicesSet.has(service)) throw new DuplicateServiceError();

    this.servicesSet.add(service);
    this.touch();

    this.events.push('barber.service.added');
  }

  public addTimeSlot(timeSlot: TimeSlot) {
    if (this.timeSlotsSet.has(timeSlot)) throw new DuplicateTimeSlotError();

    this.timeSlotsSet.add(timeSlot);
    this.touch();

    this.events.push('barber.timeSlot.added');
  }

  public addAvailableDay(availableDay: AvailableDay) {
    if (this.availableDaysSet.has(availableDay))
      throw new DuplicateAvailableDayError();

    this.availableDaysSet.add(availableDay);
    this.touch();

    this.events.push('barber.availableDay.added');
  }

  public toJSON() {
    return {
      ...this.props,
      services: [...this.servicesSet],
      availableDays: [...this.availableDaysSet],
      timeSlots: [...this.timeSlotsSet],
    } as Required<BarberProps>;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  public pullEvents(): string[] {
    const events = this.events;
    this.events = [];

    return events;
  }

  get id() {
    return this.props.id!;
  }

  get fullName() {
    return this.props.fullName;
  }

  get services() {
    return [...this.servicesSet];
  }

  get availableDays() {
    return [...this.availableDaysSet];
  }

  get timeSlots() {
    return [...this.timeSlotsSet];
  }

  get createdAt() {
    return this.props.createdAt!;
  }

  get updatedAt() {
    return this.props.updatedAt!;
  }
}

const { availableDays, timeSlots } = buildAvailability('barber-1');
const barber = Barber.restore({
  id: 'barber-1',
  fullName: 'John Doe',
  services: ['Beard Trim', 'Modern Haircut'],
  availableDays,
  timeSlots,
  createdAt: new Date(),
  updatedAt: new Date(),
});

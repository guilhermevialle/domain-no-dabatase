import { AvailableService } from '@/@types/service';
import { randomId } from '@/utils/random-id';
import { Shift } from '../entities/shift';
import { WorkDay } from '../entities/work-day';
import {
  DuplicateServiceError,
  DuplicateWorkDayError,
  EmptyServicesError,
  MissingWorkDayError,
} from '../errors/barber-errors';
import { Time } from '../value-objects/time';

type OptionalBarberProps = Partial<{
  id: string;
  createdAt: Date;
  updatedAt: Date;
}>;

interface RequiredBarberProps {
  fullName: string;
  services: AvailableService[];
  workDays: WorkDay[];
}

type BarberProps = RequiredBarberProps & OptionalBarberProps;

export class Barber {
  private props: BarberProps;
  private servicesSet: Set<AvailableService>;
  private workDaysSet: Set<WorkDay>;
  private events: string[] = [];

  private constructor(props: BarberProps) {
    this.props = {
      ...props,
      id: props.id || randomId(),
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };

    this.servicesSet = new Set(this.props.services);
    this.workDaysSet = new Set(this.props.workDays);

    this.validate();
  }

  private validate() {
    if (this.servicesSet.size < 1) throw new EmptyServicesError();
    if (this.servicesSet.size !== this.props.services.length)
      throw new DuplicateServiceError();

    if (this.workDaysSet.size < 1) throw new MissingWorkDayError();
    if (this.workDaysSet.size !== this.props.workDays.length)
      throw new DuplicateWorkDayError();
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

  public addWorkDay(workDay: WorkDay) {
    if (this.workDaysSet.has(workDay)) throw new DuplicateWorkDayError();

    this.workDaysSet.add(workDay);
    this.touch();

    this.events.push('barber.workDay.added');
  }

  public toJSON() {
    return {
      ...this.props,
      services: [...this.servicesSet],
      workDays: [...this.workDaysSet],
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

  get workDays() {
    return [...this.workDaysSet];
  }

  get createdAt() {
    return this.props.createdAt!;
  }

  get updatedAt() {
    return this.props.updatedAt!;
  }
}

Barber.create({
  fullName: 'John Doe',
  services: ['Beard Trim'],
  workDays: [
    WorkDay.create({
      weekday: 1,
      barberId: 'barber-1',
      shifts: [
        Shift.create({
          end: Time.create('17:00'),
          start: Time.create('08:00'),
          workDayId: 'work-day-1',
        }),
      ],
    }),
  ],
});

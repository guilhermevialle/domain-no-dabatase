import { randomId } from '@/utils/random-id';
import {
  DuplicateShiftError,
  InvalidWeekdayError,
  MissingShiftError,
} from '../errors/work-day-errors';
import { Shift } from './shift';

type OptionalWorkDayProps = Partial<{
  id: string;
}>;

interface RequiredWorkDayProps {
  barberId: string;
  weekday: number;
  shifts: Shift[];
}

type WorkDayProps = OptionalWorkDayProps & RequiredWorkDayProps;

export class WorkDay {
  private props: WorkDayProps;
  private shiftsSet: Set<Shift>;

  private constructor(props: WorkDayProps) {
    this.props = {
      ...props,
      id: props.id || randomId(),
    };

    this.shiftsSet = new Set(this.props.shifts);

    this.validate();
  }

  private validate() {
    if (this.props.weekday < 0 || this.props.weekday > 6)
      throw new InvalidWeekdayError();
    if (this.shiftsSet.size < 1) throw new MissingShiftError();
    if (this.shiftsSet.size !== this.props.shifts.length)
      throw new DuplicateShiftError();
  }

  static create(props: RequiredWorkDayProps) {
    return new WorkDay(props);
  }

  static restore(props: Required<WorkDayProps>) {
    return new WorkDay(props);
  }

  public toJSON() {
    return this.props as Required<WorkDayProps>;
  }

  get id() {
    return this.props.id!;
  }

  get barberId() {
    return this.props.barberId;
  }

  get weekday() {
    return this.props.weekday;
  }

  get shifts() {
    return [...this.shiftsSet];
  }
}

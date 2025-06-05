import { randomId } from '@/utils/random-id';
import { FutureDateError, SameDateError } from '../errors/shared';
import { Time } from '../value-objects/time';

type OptionalShiftProps = Partial<{
  id: string;
}>;

interface RequiredShiftProps {
  workDayId: string;
  start: Time;
  end: Time;
}

export type ShiftProps = OptionalShiftProps & RequiredShiftProps;

export class Shift {
  private props: ShiftProps;

  private constructor(props: ShiftProps) {
    this.props = {
      ...props,
      id: props.id || randomId(),
    };

    this.validate();
  }

  private validate() {
    if (this.props.start.inMinutes === this.props.end.inMinutes)
      throw new SameDateError('Start and end times cannot be the same.');

    if (this.props.start.inMinutes >= this.props.end.inMinutes)
      throw new FutureDateError('Start time must be before end time.');
  }

  static create(props: RequiredShiftProps) {
    return new Shift(props);
  }

  static restore(props: Required<ShiftProps>) {
    return new Shift(props);
  }

  public toJSON() {
    return this.props as Required<ShiftProps>;
  }

  get id() {
    return this.props.id!;
  }

  get workDayId() {
    return this.props.workDayId;
  }

  get start() {
    return this.props.start;
  }

  get end() {
    return this.props.end;
  }
}

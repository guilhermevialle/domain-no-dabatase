import { randomId } from '../../utils/random-id';
import { Time } from '../value-objects/time';

type OptionalTimeSlotProps = Partial<{
  id: string;
}>;

interface RequiredTimeSlotProps {
  availableDayId: string;
  start: Time;
  end: Time;
}

type TimeSlotProps = OptionalTimeSlotProps & RequiredTimeSlotProps;

export class TimeSlot {
  private props: TimeSlotProps;

  private constructor(props: TimeSlotProps) {
    this.props = {
      ...props,
      id: props.id || randomId(),
    };

    this.validate(this.props);
  }

  private validate(props: TimeSlotProps) {
    if (props.start.value === props.end.value) {
      throw new Error('Start and end times cannot be the same.');
    }

    if (props.start.toMinutes() >= props.end.toMinutes()) {
      throw new Error('Start time must be before end time.');
    }
  }

  static create(props: RequiredTimeSlotProps) {
    return new TimeSlot(props);
  }

  static restore(props: Required<TimeSlotProps>) {
    return new TimeSlot(props);
  }

  public toJSON() {
    return this.props as Required<TimeSlotProps>;
  }

  get id() {
    return this.props.id!;
  }

  get availableDayId() {
    return this.props.availableDayId;
  }

  get start() {
    return this.props.start;
  }

  get end() {
    return this.props.end;
  }
}

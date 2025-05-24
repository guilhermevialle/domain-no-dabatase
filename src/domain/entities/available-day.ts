import { randomId } from '../../utils/random-id';
import { InvalidWeekdayError } from '../errors/available-day-errors';

type OptionalAvailableDayProps = Partial<{
  id: string;
}>;
interface RequiredAvailableDayProps {
  barberId: string;
  weekday: number;
}

type AvailableDayProps = OptionalAvailableDayProps & RequiredAvailableDayProps;

export class AvailableDay {
  private props: AvailableDayProps;

  private constructor(props: AvailableDayProps) {
    this.props = {
      ...props,
      id: props.id || randomId(),
    };

    this.validate(this.props);
  }

  private validate(props: AvailableDayProps) {
    if (props.weekday < 0 || props.weekday > 6) {
      throw new InvalidWeekdayError();
    }
  }

  static create(props: RequiredAvailableDayProps) {
    return new AvailableDay(props);
  }

  static restore(props: Required<AvailableDayProps>) {
    return new AvailableDay(props);
  }

  public toJSON() {
    return this.props as Required<AvailableDayProps>;
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
}

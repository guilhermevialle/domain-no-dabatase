import { randomId } from '../../utils/random-id';

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

  constructor(props: AvailableDayProps) {
    this.props = props;

    if (!this.props.id) this.props.id = randomId();

    if (this.props.weekday < 0 || this.props.weekday > 6) {
      throw new Error('Weekday must be between 0 (Sunday) and 6 (Saturday).');
    }
  }

  public toJSON() {
    return this.props;
  }

  get id() {
    return this.props.id;
  }

  get barberId() {
    return this.props.barberId;
  }

  get weekday() {
    return this.props.weekday;
  }
}

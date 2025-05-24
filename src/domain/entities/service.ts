import { AvailableService } from '../../@types/service';
import { randomId } from '../../utils/random-id';
import {
  InvalidDurationError,
  InvalidPriceError,
} from '../errors/service-errors';

type OptionalServiceProps = Partial<{
  id: string;
}>;

interface RequiredServiceProps {
  name: AvailableService;
  duration: number;
  priceInCents: number;
}

type ServiceProps = OptionalServiceProps & RequiredServiceProps;

export class Service {
  private props: ServiceProps;

  private constructor(props: ServiceProps) {
    this.props = {
      ...props,
      id: props.id ?? randomId(),
    };

    this.validate(this.props);
  }

  private validate(props: ServiceProps) {
    if (props.priceInCents < 100)
      throw new InvalidPriceError('Price must be at least 100 cents.');

    if (props.duration <= 0)
      throw new InvalidDurationError('Duration must be greater than 0.');

    if (props.duration % 30 !== 0) {
      throw new InvalidDurationError(
        'Duration must be a multiple of 30 minutes.',
      );
    }
  }

  static create(props: RequiredServiceProps) {
    return new Service(props);
  }

  static restore(props: Required<ServiceProps>) {
    return new Service(props);
  }

  public toJSON() {
    return this.props as Required<ServiceProps>;
  }

  get id() {
    return this.props.id!;
  }

  get name() {
    return this.props.name;
  }

  get duration() {
    return this.props.duration;
  }

  get priceInCents() {
    return this.props.priceInCents;
  }
}

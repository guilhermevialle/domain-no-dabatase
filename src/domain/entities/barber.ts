import { AvailableService } from '../../@types/service';
import { randomId } from '../../utils/random-id';
import {
  DuplicateServiceError,
  EmptyServicesError,
} from '../errors/barber-errors';

type OptionalBarberProps = Partial<{
  id: string;
}>;

interface RequiredBarberProps {
  fullName: string;
  services: AvailableService[];
}

type BarberProps = OptionalBarberProps & RequiredBarberProps;

export class Barber {
  private props: BarberProps;

  private constructor(props: BarberProps) {
    this.props = {
      ...props,
      id: props.id || randomId(),
    };

    this.validate(this.props);
  }

  public offersService(service: AvailableService): boolean {
    return this.props.services.includes(service);
  }

  private validate(props: BarberProps) {
    const offeredServices = new Set(props.services);

    if (offeredServices.size < 1) throw new EmptyServicesError();

    if (offeredServices.size !== props.services.length)
      throw new DuplicateServiceError();
  }

  static create(props: RequiredBarberProps) {
    return new Barber(props);
  }

  static restore(props: Required<BarberProps>) {
    return new Barber(props);
  }

  public toJSON() {
    return this.props as Required<BarberProps>;
  }
  get id() {
    return this.props.id!;
  }

  get fullName() {
    return this.props.fullName;
  }

  get services() {
    return this.props.services;
  }
}

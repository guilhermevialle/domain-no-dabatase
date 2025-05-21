import { AvailableService } from '../../@types/service';
import { randomId } from '../../utils/random-id';

type OptionalBarberProps = Partial<{
  id: string;
}>;

interface RequiredBarberProps {
  since: Date;
  fullName: string;
  services: AvailableService[];
}

type BarberProps = OptionalBarberProps & RequiredBarberProps;

export class Barber {
  private props: BarberProps;

  constructor(props: BarberProps) {
    this.props = {
      ...props,
      id: props.id || randomId(),
    };

    this.validate(this.props);
  }

  public canDoService(service: AvailableService): boolean {
    return this.props.services.includes(service);
  }

  private validate(props: BarberProps) {
    const servicesSet = new Set(props.services);

    if (servicesSet.size < 1)
      throw new Error('Must have at least 1 specialty.');

    if (servicesSet.size !== props.services.length) {
      throw new Error('Duplicate services are not allowed.');
    }
  }

  public toJSON() {
    return this.props;
  }
  get id() {
    return this.props.id;
  }

  get since() {
    return this.props.since;
  }

  get fullName() {
    return this.props.fullName;
  }

  get services() {
    return this.props.services;
  }
}

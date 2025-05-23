import { randomId } from '../../utils/random-id';
import { Email } from '../value-objects/email';
import { BrazilPhone } from '../value-objects/phone';

type OptionalCustomerProps = Partial<{
  id: string;
}>;
interface RequiredCustomerProps {
  fullName: string;
  email: Email;
  phone: BrazilPhone;
}

type CustomerProps = OptionalCustomerProps & RequiredCustomerProps;
export class Customer {
  private props: CustomerProps;

  private constructor(props: CustomerProps) {
    this.props = props;

    if (!this.props.id) this.props.id = randomId();
  }

  static create(props: RequiredCustomerProps) {
    return new Customer(props);
  }

  static restore(props: Required<CustomerProps>) {
    return new Customer(props);
  }

  public toJSON() {
    return this.props as Required<CustomerProps>;
  }

  get id() {
    return this.props.id!;
  }

  get fullName() {
    return this.props.fullName;
  }

  get email() {
    return this.props.email.value;
  }

  get phone() {
    return this.props.phone.value;
  }
}

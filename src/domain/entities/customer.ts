import { randomId } from '@/utils/random-id';
import { BrazilPhone } from '../value-objects/brazil-phone';
import { Email } from '../value-objects/email';

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
    this.props = {
      ...props,
      id: props.id || randomId(),
    };

    this.validate(this.props);
  }

  private validate(props: CustomerProps) {}

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

import { Email } from '../value-objects/email'
import { Phone } from '../value-objects/phone'

interface CustomerProps {
  id: string
  fullName: string
  email: Email
  phone: Phone
}

export class Customer {
  private props: CustomerProps

  constructor(props: CustomerProps) {
    this.props = props
  }

  get id() {
    return this.props.id
  }

  get fullName() {
    return this.props.fullName
  }

  get email() {
    return this.props.email.value
  }

  get phone() {
    return this.props.phone.value
  }
}

import { AvailableService } from '../../@types/service'
import { randomId } from '../../utils/random-id'

type OptionalServiceProps = Partial<{
  id: string
}>

interface RequiredServiceProps {
  name: AvailableService
  duration: number
  priceInCents: number
}

type ServiceProps = OptionalServiceProps & RequiredServiceProps

export class Service {
  private props: ServiceProps

  constructor(props: ServiceProps) {
    this.props = {
      ...props,
      id: props.id ?? randomId(),
    }

    this.validate(this.props)
  }

  private validate(props: ServiceProps) {
    if (props.duration <= 0) throw new Error('Invalid duration.')

    if (props.duration % 5 !== 0) {
      throw new Error('Duration must be a multiple of 5 minutes.')
    }
  }

  get id() {
    return this.props.id
  }

  get name() {
    return this.props.name
  }

  get duration() {
    return this.props.duration
  }

  get priceInCents() {
    return this.props.priceInCents
  }

  public toJSON() {
    return this.props
  }
}

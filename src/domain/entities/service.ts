import { SERVICES, Service as TService } from '../../@types/service'
import { randomId } from '../../utils/random-id'

type OptionalServiceProps = Partial<{
  id: string
}>

interface RequiredServiceProps {
  name: TService
  price: number
}

type ServiceProps = OptionalServiceProps & RequiredServiceProps

export class Service {
  private props: ServiceProps

  constructor(props: ServiceProps) {
    this.props = props

    if (!this.props.id) this.props.id = randomId()

    if (!Object.values(SERVICES).includes(props.name)) {
      throw new Error(`Invalid service name: ${props.name}`)
    }
  }

  get id() {
    return this.props.id
  }

  get name() {
    return this.props.name
  }

  get price() {
    return this.props.price
  }

  public toJSON() {
    return this.props
  }
}

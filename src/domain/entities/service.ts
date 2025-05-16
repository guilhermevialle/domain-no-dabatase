import { SERVICES, Service as TService } from '../../@types/barber'

interface ServiceProps {
  id: string
  name: TService
}

export class Service {
  private props: ServiceProps

  constructor(props: ServiceProps) {
    if (!Object.values(SERVICES).includes(props.name)) {
      throw new Error(`Invalid service name: ${props.name}`)
    }

    this.props = props
  }

  get id(): string {
    return this.props.id
  }

  get name(): TService {
    return this.props.name
  }

  public toJSON() {
    return this.props
  }
}

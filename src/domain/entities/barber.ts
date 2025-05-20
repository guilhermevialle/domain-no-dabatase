import { Service } from '../../@types/service'
import { randomId } from '../../utils/random-id'

type OptionalBarberProps = Partial<{
  id: string
}>

interface RequiredBarberProps {
  since: Date
  fullName: string
  services: Service[]
  bufferTimeMinutes?: number
}

type BarberProps = OptionalBarberProps & RequiredBarberProps

export class Barber {
  private props: BarberProps

  constructor(props: BarberProps) {
    this.props = {
      ...props,
      id: props.id || randomId(),
      bufferTimeMinutes: props.bufferTimeMinutes ?? 10,
    }

    this.validate(props)
  }

  private validate(props: BarberProps) {
    const servicesSet = new Set(props.services)

    if (this.props.bufferTimeMinutes! % 5 !== 0)
      throw new Error('Buffer time must be in 5-minute increments.')

    if (this.props.bufferTimeMinutes! > 30 || this.props.bufferTimeMinutes! < 5)
      throw new Error('Buffer time must be between 5 and 30 minutes.')

    if (servicesSet.size < 1) throw new Error('Must have at least 1 specialty.')

    if (servicesSet.size !== props.services.length) {
      throw new Error('Duplicate services are not allowed.')
    }
  }

  get id() {
    return this.props.id
  }

  get since() {
    return this.props.since
  }

  get fullName() {
    return this.props.fullName
  }

  get services() {
    return this.props.services
  }

  get bufferTimeMinutes() {
    return this.props.bufferTimeMinutes
  }
}

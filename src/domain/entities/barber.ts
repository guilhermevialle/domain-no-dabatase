import { Service } from '../../@types/service'
import { randomId } from '../../utils/random-id'

type OptionalBarberProps = Partial<{
  id: string
}>

interface RequiredBarberProps {
  since: Date
  fullName: string
  services: Service[]
  bufferTimeMinutes: number
}

type BarberProps = OptionalBarberProps & RequiredBarberProps

export class Barber {
  private props: BarberProps

  constructor(props: BarberProps) {
    this.props = props

    if (!this.props.id) this.props.id = randomId()

    const servicesSet = new Set(props.services)

    if (this.props.bufferTimeMinutes > 20 || this.props.bufferTimeMinutes < 10)
      throw new Error('Buffer time must be between 10 and 20 minutes.')

    if (servicesSet.size < 1) throw new Error('Must have at least 1 specialty.')

    if (servicesSet.size !== props.services.length) {
      throw new Error('Duplicate services are not allowed.')
    }
  }

  get services() {
    return this.props.services
  }

  get fullName() {
    return this.props.fullName
  }

  get id() {
    return this.props.id
  }
}

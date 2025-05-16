import { Service } from '../../@types/barber'

interface BarberProps {
  id: string
  since: Date
  fullName: string
  services: Service[]
}

export class Barber {
  private props: BarberProps

  constructor(props: BarberProps) {
    this.props = props

    const specialtiesSet = new Set(props.services)

    if (specialtiesSet.size < 1)
      throw new Error('Must have at least 1 specialty.')

    if (specialtiesSet.size !== props.services.length) {
      throw new Error('Duplicate specialties are not allowed.')
    }
  }

  get specialties() {
    return this.props.services
  }

  get fullName() {
    return this.props.fullName
  }

  get id() {
    return this.props.id
  }
}

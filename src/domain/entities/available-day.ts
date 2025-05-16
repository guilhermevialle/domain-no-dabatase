interface AvailableDayProps {
  id: string
  barberId: string
  weekday: number
}

export class AvailableDay {
  private props: AvailableDayProps

  constructor(props: AvailableDayProps) {
    if (props.weekday < 0 || props.weekday > 6) {
      throw new Error('Weekday must be between 0 (Sunday) and 6 (Saturday).')
    }

    this.props = props
  }

  get id() {
    return this.props.id
  }

  get barberId() {
    return this.props.barberId
  }

  get weekday() {
    return this.props.weekday
  }
}

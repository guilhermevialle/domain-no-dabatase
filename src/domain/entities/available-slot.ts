import { Time } from '../value-objects/time'

interface AvailableSlotProps {
  id: string
  availableDayId: string
  start: Time
  end: Time
}

export class AvailableSlot {
  private props: AvailableSlotProps

  constructor(props: AvailableSlotProps) {
    const { start, end } = props

    if (start.value === end.value) {
      throw new Error('Start and end times cannot be the same.')
    }

    if (start.toMinutes() >= end.toMinutes()) {
      throw new Error('Start time must be before end time.')
    }

    this.props = props
  }

  get id() {
    return this.props.id
  }

  get availableDayId() {
    return this.props.availableDayId
  }

  get start() {
    return this.props.start
  }

  get end() {
    return this.props.end
  }

  public toJSON() {
    return this.props
  }
}

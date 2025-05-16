import { differenceInMinutes, isBefore, isPast } from 'date-fns'
import { Service, SERVICES } from '../../@types/barber'

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED'

interface AppointmentProps {
  id: string
  customerId: string
  barberId: string
  service: Service
  status: AppointmentStatus
  startAt: Date
  endAt: Date
}

export class Appointment {
  private props: AppointmentProps

  constructor(props: AppointmentProps) {
    this.props = props
    const { startAt, endAt } = props

    const allowedServices = Object.values(SERVICES)

    if (!allowedServices.includes(this.props.service)) {
      throw new Error('Cannot create custom Appointment service.')
    }
    if (isPast(startAt)) throw new Error('Start date must be in the future.')

    if (isBefore(endAt, startAt))
      throw new Error('End date must be after start date.')

    if (differenceInMinutes(endAt, startAt) > 90)
      throw new Error(
        'Appointment cannot be longer than 1 hour and 30 minutes.'
      )
  }

  public cancel() {
    const cancellationDate = new Date()

    const minutesUntilStart = differenceInMinutes(
      this.props.startAt,
      cancellationDate
    )

    if (minutesUntilStart < 5)
      throw new Error(
        'Cannot cancel appointment less than 5 minutes before the start time.'
      )

    return new Appointment({
      ...this.props,
      status: 'CANCELED',
    })
  }

  get id() {
    return this.props.id
  }

  get customerId() {
    return this.props.customerId
  }

  get barberId() {
    return this.props.barberId
  }

  get service() {
    return this.props.service
  }

  get status() {
    return this.props.status
  }

  get startAt() {
    return this.props.startAt
  }

  get endAt() {
    return this.props.endAt
  }

  public toJSON() {
    return this.props
  }
}

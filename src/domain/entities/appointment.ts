import { addMinutes, differenceInMinutes, getDay, isPast } from 'date-fns'
import { AppointmentStatus } from '../../@types/appointment'
import {
  Service,
  SERVICES,
  SERVICES_DURATION,
  SERVICES_PRICE_IN_CENTS,
} from '../../@types/service'
import { randomId } from '../../utils/random-id'
import { Time } from '../value-objects/time'

type OptionalAppointmentProps = Partial<{
  id: string
  estimatedDurationMinutes: number
  priceInCents: number
  createdAt: Date
  updatedAt: Date
}>

interface RequiredAppointmentProps {
  customerId: string
  barberId: string
  service: Service
  status: AppointmentStatus
  startAt: Date
}

type AppointmentProps = OptionalAppointmentProps & RequiredAppointmentProps

export class Appointment {
  private props: AppointmentProps

  constructor(props: AppointmentProps) {
    this.props = props

    if (!this.props.createdAt) this.props.createdAt = new Date()
    if (!this.props.updatedAt) this.props.updatedAt = new Date()
    if (this.props.id) this.props.id = randomId()

    if (!this.props.estimatedDurationMinutes)
      this.props.estimatedDurationMinutes =
        SERVICES_DURATION[this.props.service]

    if (!this.props.priceInCents)
      this.props.priceInCents = SERVICES_PRICE_IN_CENTS[this.props.service]

    const { startAt, estimatedDurationMinutes } = this.props

    if (!Object.values(SERVICES).includes(this.props.service))
      throw new Error('Cannot create custom Appointment service.')

    if (estimatedDurationMinutes % 5 !== 0)
      throw new Error('Estimated duration must be in 5-minute increments.')

    if (isPast(startAt)) throw new Error('Start date must be in the future.')

    if (estimatedDurationMinutes <= 0)
      throw new Error('Estimated duration must be greater than 0.')
  }

  public touch() {
    this.props.updatedAt = new Date()
  }

  public finish() {
    this.props.status = 'FINISHED'
    this.touch()
  }

  public cancel() {
    const now = new Date()
    const minutesUntilStart = differenceInMinutes(this.props.startAt, now)

    if (minutesUntilStart < 10)
      throw new Error(
        'Cannot cancel appointment less than 10 minutes before the start time.'
      )

    this.props.status = 'CANCELED'
    this.touch()
  }

  public getTime() {
    return new Time(this.startAt)
  }

  public getDay() {
    return getDay(this.props.startAt)
  }

  public toJSON() {
    return {
      ...this.props,
      endAt: this.endAt,
    }
  }

  // getters
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

  get priceInCents() {
    return this.props.priceInCents
  }

  get startAt() {
    return this.props.startAt
  }

  get estimatedDurationMinutes() {
    return this.props.estimatedDurationMinutes
  }

  get endAt() {
    return addMinutes(this.props.startAt, this.props.estimatedDurationMinutes!)
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}

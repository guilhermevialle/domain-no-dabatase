import { addMinutes, differenceInMinutes, getDay, isPast } from 'date-fns'
import { AppointmentStatus } from '../../@types/appointment'
import {
  AVAILABLE_SERVICES,
  AvailableService,
  BASE_DURATIONS_IN_MINUTES,
  BASE_PRICES_IN_CENTS,
} from '../../@types/service'
import { randomId } from '../../utils/random-id'
import { Time } from '../value-objects/time'

type OptionalAppointmentProps = Partial<{
  id: string
  duration: number
  priceInCents: number
  createdAt: Date
  status: AppointmentStatus
  updatedAt: Date
  endAt: Date
}>

interface RequiredAppointmentProps {
  customerId: string
  barberId: string
  service: AvailableService
  startAt: Date
}

export type AppointmentProps = RequiredAppointmentProps &
  OptionalAppointmentProps

export class Appointment {
  private props: AppointmentProps

  constructor(props: AppointmentProps) {
    this.props = {
      ...props,
      id: props.id ?? randomId(),
      status: props.status ?? 'SCHEDULED',
      duration: props.duration ?? BASE_DURATIONS_IN_MINUTES[props.service],
      priceInCents: props.priceInCents ?? BASE_PRICES_IN_CENTS[props.service],
      endAt: props.endAt ?? addMinutes(props.startAt, props.duration!),
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    }

    this.validate(this.props)
  }

  private validate(props: AppointmentProps) {
    if (props.duration! % 5 !== 0) {
      throw new Error('Duration must be a multiple of 5 minutes.')
    }

    if (!AVAILABLE_SERVICES.includes(props.service))
      throw new Error('Cannot create custom Appointment service.')

    if (isPast(props.startAt))
      throw new Error('Start date must be in the future.')
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
    return this.props
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
    return this.props.duration
  }

  get endAt() {
    return addMinutes(this.props.startAt, this.props.duration!)
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}

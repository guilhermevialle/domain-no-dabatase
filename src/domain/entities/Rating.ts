import { randomId } from '../../utils/random-id'

type OptionalRatingProps = Partial<{
  id: string
  comment: string
  createdAt: Date
}>

interface RequiredRatingProps {
  appointmentId: string
  barberId: string
  customerId: string
  rating: number
}

type RatingProps = RequiredRatingProps & OptionalRatingProps

export class Rating {
  private props: RatingProps

  constructor(props: RatingProps) {
    this.props = {
      ...props,
      id: props.id ?? randomId(),
      comment: props.comment ?? '',
      createdAt: props.createdAt ?? new Date(),
    }

    this.validate(this.props)
  }

  private validate(props: RatingProps) {
    if (props.rating < 1 || props.rating > 5)
      throw new Error('Rating must be between 1 and 5.')

    if (props.comment!.length > 255)
      throw new Error('Comment must be under 255 characters.')
  }

  toJSON() {
    return this.props
  }

  // Getters
  get id() {
    return this.props.id
  }

  get appointmentId() {
    return this.props.appointmentId
  }

  get barberId() {
    return this.props.barberId
  }

  get customerId() {
    return this.props.customerId
  }

  get rating() {
    return this.props.rating
  }

  get comment() {
    return this.props.comment
  }

  get createdAt() {
    return this.props.createdAt
  }
}

new Rating({
  appointmentId: 'appointment-id',
  barberId: 'barber-id',
  customerId: 'customer-id',
  rating: 5,
})

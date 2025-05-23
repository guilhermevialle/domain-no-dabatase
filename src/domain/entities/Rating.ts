import { randomId } from '../../utils/random-id';

type OptionalRatingProps = Partial<{
  id: string;
  createdAt: Date;
}>;

export interface RequiredRatingProps {
  appointmentId: string;
  barberId: string;
  customerId: string;
  comment: string;
  rating: number;
}

type RatingProps = RequiredRatingProps & OptionalRatingProps;

export class Rating {
  private props: RatingProps;

  private constructor(props: RatingProps) {
    this.props = {
      ...props,
      id: props.id ?? randomId(),
      createdAt: props.createdAt ?? new Date(),
    };

    this.validate(this.props);
  }

  private validate(props: RatingProps) {
    if (props.comment.length > 255)
      throw new Error('Comment must be under 255 characters.');

    if (props.rating < 1 || props.rating > 5)
      throw new Error('Rating must be between 1 and 5.');

    if (props.comment!.length > 255)
      throw new Error('Comment must be under 255 characters.');
  }

  static create(props: RequiredRatingProps) {
    return new Rating(props);
  }

  static restore(props: Required<RatingProps>) {
    return new Rating(props);
  }

  toJSON() {
    return this.props as Required<RatingProps>;
  }

  get id() {
    return this.props.id!;
  }

  get appointmentId() {
    return this.props.appointmentId;
  }

  get barberId() {
    return this.props.barberId;
  }

  get customerId() {
    return this.props.customerId;
  }

  get rating() {
    return this.props.rating;
  }

  get comment() {
    return this.props.comment;
  }

  get createdAt() {
    return this.props.createdAt!;
  }
}

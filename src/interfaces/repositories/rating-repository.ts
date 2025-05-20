import { Rating } from '../../domain/entities/rating'

export interface IRatingRepository {
  create(rating: Rating): Promise<void>
  findById(id: string): Promise<Rating | null>
  findByAppointmentId(appointmentId: string): Promise<Rating | null>
  findByBarberId(barberId: string): Promise<Rating[]>
  findByCustomerId(customerId: string): Promise<Rating[]>
}

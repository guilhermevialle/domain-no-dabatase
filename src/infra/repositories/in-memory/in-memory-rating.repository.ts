import { Rating } from '../../../domain/entities/rating';
import { IRatingRepository } from '../../../interfaces/repositories/rating-repository';

export class InMemoryRatingRepository implements IRatingRepository {
  private ratings: Rating[] = [];

  async create(rating: Rating): Promise<void> {
    this.ratings.push(rating);
  }

  async findById(id: string): Promise<Rating | null> {
    const rating = this.ratings.find((r) => r.id === id);
    return rating ?? null;
  }

  async findByAppointmentId(id: string): Promise<Rating | null> {
    const rating = this.ratings.find((r) => r.appointmentId === id);
    return rating ?? null;
  }

  async findByBarberId(id: string): Promise<Rating[]> {
    return this.ratings.filter((r) => r.barberId === id);
  }

  async findByCustomerId(id: string): Promise<Rating[]> {
    return this.ratings.filter((r) => r.customerId === id);
  }
}

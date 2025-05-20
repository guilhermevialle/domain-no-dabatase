import { Barber } from '../../domain/entities/barber'

export interface IBarberAvailabilityService {
  isBarberAvailable(
    barber: Barber,
    startAt: Date,
    endAt: Date
  ): Promise<boolean>
}

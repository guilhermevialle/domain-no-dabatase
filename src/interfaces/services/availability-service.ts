export interface IAvailabilityService {
  isBarberAvailable(barberId: string, startAt: Date): Promise<boolean>;
}

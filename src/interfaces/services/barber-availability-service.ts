export interface IBarberAvailabilityService {
  isAvailable(barberId: string, startAt: Date, endAt: Date): Promise<boolean>;
}

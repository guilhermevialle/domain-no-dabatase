export interface IBarberAvailabilityService {
  isAvailable(barberId: string, start: Date, end: Date): Promise<boolean>
}

export interface IAvailabilityService {
  isBarberAvailable(
    barberId: string,
    startAt: Date,
    ignoreAppointmentId?: string,
  ): Promise<boolean>;
  isWithinBarberShift(barberId: string, startAt: Date): Promise<boolean>;
  isOverlappingByDateAndBarberId: (
    barberId: string,
    startAt: Date,
    ignoreAppointmentId?: string,
  ) => Promise<boolean>;
}

export interface IAvailabilityService {
  isBarberAvailable(
    barberId: string,
    startAt: Date,
    ignoreAppointmentId?: string,
  ): Promise<boolean>;
  findBusyTimesByBarberInRange: (
    barberId: string,
    startAt: Date,
    endAt: Date,
  ) => Promise<Record<string, string[]>>;
}

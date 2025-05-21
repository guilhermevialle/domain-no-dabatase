export interface IBarberAvailabilityService {
  isBarberAvailable(
    barberId: string,
    startAt: Date,
    endAt: Date,
    ignoreAppointmentId?: string
  ): Promise<boolean>
}

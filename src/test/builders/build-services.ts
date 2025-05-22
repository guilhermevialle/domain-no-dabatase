import { BarberAvailabilityService } from '../../domain/services/barber-availability.service';
import { buildRepositories } from './build-repositories';

export interface IBuildServices {
  barberAvailability: BarberAvailabilityService;
}

export function buildServices(): IBuildServices {
  const repos = buildRepositories();

  const barberAvailability = new BarberAvailabilityService(
    repos.appointmentRepo,
    repos.availableDayRepo,
    repos.timeSlotRepo,
    repos.barberRepo,
  );

  return { barberAvailability };
}

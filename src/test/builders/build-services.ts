import { AvailabilityService } from '../../domain/services/availability.service';
import { IAvailabilityService } from '../../interfaces/services/availability-service';
import { buildRepositories } from './build-repositories';

export interface IBuildServices {
  availability: IAvailabilityService;
}

export function buildServices(): IBuildServices {
  const repos = buildRepositories();

  const availability = new AvailabilityService(
    repos.availableDayRepo,
    repos.timeSlotRepo,
  );

  return { availability };
}

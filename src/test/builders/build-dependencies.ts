import { AvailabilityService } from '../../domain/services/availability-service';
import { InMemoryAppointmentRepository } from '../../infra/repositories/in-memory/in-memory-appointment-repository';
import { InMemoryBarberRepository } from '../../infra/repositories/in-memory/in-memory-barber-repository';
import { InMemoryCustomerRepository } from '../../infra/repositories/in-memory/in-memory-customer-repository';
import { InMemoryRatingRepository } from '../../infra/repositories/in-memory/in-memory-rating-repository';

export interface IBuildDependecies {
  customerRepo: InMemoryCustomerRepository;
  barberRepo: InMemoryBarberRepository;
  appointmentRepo: InMemoryAppointmentRepository;
  ratingRepo: InMemoryRatingRepository;
  availabilityService: AvailabilityService;
}

export function buildDependencies(): IBuildDependecies {
  const customerRepo = new InMemoryCustomerRepository();
  const barberRepo = new InMemoryBarberRepository();
  const appointmentRepo = new InMemoryAppointmentRepository();
  const ratingRepo = new InMemoryRatingRepository();
  const availabilityService = new AvailabilityService(
    barberRepo,
    appointmentRepo,
  );

  return {
    customerRepo,
    barberRepo,
    appointmentRepo,
    ratingRepo,
    availabilityService,
  };
}

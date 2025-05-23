import { AvailabilityService } from '../../domain/services/availability-service';
import { InMemoryAppointmentRepository } from '../../infra/repositories/in-memory/in-memory-appointment-repository';
import { InMemoryAvailableDayRepository } from '../../infra/repositories/in-memory/in-memory-available-day-repository';
import { InMemoryBarberRepository } from '../../infra/repositories/in-memory/in-memory-barber-repository';
import { InMemoryCustomerRepository } from '../../infra/repositories/in-memory/in-memory-customer-repository';
import { InMemoryRatingRepository } from '../../infra/repositories/in-memory/in-memory-rating-repository';
import { InMemoryTimeSlotRepository } from '../../infra/repositories/in-memory/in-memory-time-slot-repository';

export interface IBuildDependecies {
  customerRepo: InMemoryCustomerRepository;
  barberRepo: InMemoryBarberRepository;
  appointmentRepo: InMemoryAppointmentRepository;
  availableDayRepo: InMemoryAvailableDayRepository;
  timeSlotRepo: InMemoryTimeSlotRepository;
  ratingRepo: InMemoryRatingRepository;
  availabilityService: AvailabilityService;
}

export function buildDependencies(): IBuildDependecies {
  const customerRepo = new InMemoryCustomerRepository();
  const barberRepo = new InMemoryBarberRepository();
  const appointmentRepo = new InMemoryAppointmentRepository();
  const availableDayRepo = new InMemoryAvailableDayRepository();
  const timeSlotRepo = new InMemoryTimeSlotRepository();
  const ratingRepo = new InMemoryRatingRepository();
  const availabilityService = new AvailabilityService(
    availableDayRepo,
    timeSlotRepo,
    appointmentRepo,
  );

  return {
    customerRepo,
    barberRepo,
    appointmentRepo,
    availableDayRepo,
    timeSlotRepo,
    ratingRepo,
    availabilityService,
  };
}

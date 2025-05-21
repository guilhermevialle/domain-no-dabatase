import { InMemoryAppointmentRepository } from '../../infra/repositories/in-memory/in-memory-appointment-repository';
import { InMemoryAvailableDayRepository } from '../../infra/repositories/in-memory/in-memory-available-day-repository';
import { InMemoryBarberRepository } from '../../infra/repositories/in-memory/in-memory-barber-repository';
import { InMemoryCustomerRepository } from '../../infra/repositories/in-memory/in-memory-customer-repository';
import { InMemoryRatingRepository } from '../../infra/repositories/in-memory/in-memory-rating-repository';
import { InMemoryTimeSlotRepository } from '../../infra/repositories/in-memory/in-memory-time-slot-repository';

export function buildRepositories() {
  const customerRepo = new InMemoryCustomerRepository();
  const barberRepo = new InMemoryBarberRepository();
  const appointmentRepo = new InMemoryAppointmentRepository();
  const availableDayRepo = new InMemoryAvailableDayRepository();
  const timeSlotRepo = new InMemoryTimeSlotRepository();
  const ratingRepo = new InMemoryRatingRepository();

  return {
    customerRepo,
    barberRepo,
    appointmentRepo,
    availableDayRepo,
    timeSlotRepo,
    ratingRepo,
  };
}

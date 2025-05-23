import { AvailabilityService } from '../domain/services/availability-service';
import { InMemoryAppointmentRepository } from '../infra/repositories/in-memory/in-memory-appointment-repository';
import { InMemoryAvailableDayRepository } from '../infra/repositories/in-memory/in-memory-available-day-repository';
import { InMemoryBarberRepository } from '../infra/repositories/in-memory/in-memory-barber-repository';
import { InMemoryCustomerRepository } from '../infra/repositories/in-memory/in-memory-customer-repository';
import { InMemoryRatingRepository } from '../infra/repositories/in-memory/in-memory-rating-repository';
import { InMemoryTimeSlotRepository } from '../infra/repositories/in-memory/in-memory-time-slot-repository';

export const customerRepo = new InMemoryCustomerRepository();
export const barberRepo = new InMemoryBarberRepository();
export const appointmentRepo = new InMemoryAppointmentRepository();
export const availableDayRepo = new InMemoryAvailableDayRepository();
export const timeSlotRepo = new InMemoryTimeSlotRepository();
export const ratingRepo = new InMemoryRatingRepository();
export const availabilityService = new AvailabilityService(
  availableDayRepo,
  timeSlotRepo,
  appointmentRepo,
);

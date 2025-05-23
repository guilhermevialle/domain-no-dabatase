import { addMinutes } from 'date-fns';
import {
  appointmentRepo,
  availabilityService,
  availableDayRepo,
  barberRepo,
  timeSlotRepo,
} from './config/depencies';
import { buildAvailability } from './test/builders/build-barber-availability';
import { buildAppointment, buildBarber } from './test/builders/build-entities';

const barber = buildBarber('barber-1');
const now = new Date();

async function run() {
  await barberRepo.create(barber);

  const { availableDays, timeSlots } = buildAvailability(barber.id!, {
    startDay: 0,
    endDay: 6,
    startTime: '08:00',
    endTime: '17:40',
  });

  await availableDayRepo.createMany(availableDays);
  await timeSlotRepo.createMany(timeSlots);
  await appointmentRepo.create(
    buildAppointment({
      barberId: barber.id!,
      customerId: 'customer-1',
      startAt: addMinutes(now, 10),
    }),
  );

  const isAvailableNow = await availabilityService.isBarberAvailable(
    barber.id!,
    now,
  );

  console.log(isAvailableNow);
}

run();

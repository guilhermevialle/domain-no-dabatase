import { isWithinInterval } from 'date-fns';
import { buildAvailability } from './test/builders/build-barber-availability';
import { buildBarber } from './test/builders/build-entities';
import { buildRepositories } from './test/builders/build-repositories';
import { buildServices } from './test/builders/build-services';

const repos = buildRepositories();
const services = buildServices();
const barber = buildBarber('barber-1');
const now = new Date();

async function run() {
  await repos.barberRepo.create(barber);
  const startAt = new Date();

  const { availableDays, timeSlots } = buildAvailability(barber.id!, {
    startDay: 0,
    endDay: 5,
    startTime: '00:13',
    endTime: '00:17',
  });

  const weekday = startAt.getDay();

  const availableDay = availableDays.find((day) => day.weekday === weekday);

  if (!availableDay) return console.log(false);

  const some = timeSlots.some((slot) =>
    isWithinInterval(startAt, {
      start: slot.start.toDate(startAt),
      end: slot.end.toDate(startAt),
    }),
  );

  if (some) return console.log(true);

  return console.log(false);
}

run();

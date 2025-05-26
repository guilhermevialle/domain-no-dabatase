import { Barber } from './domain/aggregates/barber';
import { buildAvailability } from './test/builders/build-availability';

try {
  const { workDays } = buildAvailability('barber-1');

  const barber = Barber.create({
    fullName: 'John Doe',
    services: ['Beard Trim', 'Clean Shave'],
    workDays,
  });

  console.log(JSON.stringify(barber, null, 2));
} catch (error: any) {
  console.log(error.message);
}

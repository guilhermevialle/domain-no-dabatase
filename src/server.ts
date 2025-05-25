import { Barber } from './domain/aggregates/barber';
import { buildAvailability } from './test/builders/build-barber-availability';

const log = (...args: any) => console.log(...args);

try {
  const { availableDays, timeSlots } = buildAvailability('barber-1');

  const barber = Barber.restore({
    id: 'barber-1',
    fullName: 'John Doe',
    services: ['Beard Trim', 'Modern Haircut'],
    availableDays,
    timeSlots,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
} catch (err: any) {
  console.error(err.message);
}

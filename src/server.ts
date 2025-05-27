import { isWithinInterval } from 'date-fns';
import { Time } from './domain/value-objects/time';

const start = Time.create('08:00');
const end = Time.create('12:30');
const now = new Date();

now.setTime(now.getTime() + 2 * 60 * 60 * 1000);

console.log(start.toDate(now), end.toDate(now), Time.create(now).toDate(now));

const withinInterval = isWithinInterval(now, {
  start: start.toDate(now),
  end: end.toDate(now),
});

console.log(withinInterval);

import { describe, it } from 'vitest';
import { Barber } from '../domain/aggregates/barber';
import { buildAvailability } from '../test/builders/build-availability';
import { buildSchedule } from './build-schedule';

describe('Build Schedule Util', () => {
  it('should build schedule', () => {
    const { workDays } = buildAvailability('barber-1', {
      startDay: 0,
      endDay: 5,
      intervals: [
        {
          start: '08:00',
          end: '12:00',
        },
        {
          start: '13:00',
          end: '17:30',
        },
      ],
    });
    const barber = Barber.restore({
      id: 'barber-1',
      fullName: 'John Doe',
      services: ['Beard Trim', 'Clean Shave'],
      workDays,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const busy = {
      '2025-05-27': ['08:30', '09:00', '09:30', '10:00', '10:30', '11:00'],
      '2025-05-28': ['08:30', '10:00', '11:00'],
      '2025-05-29': ['08:30', '09:00'],
    };

    const schedule = buildSchedule(barber, {
      daysAhead: 7,
      busy,
    });

    console.log(schedule);
  });
});

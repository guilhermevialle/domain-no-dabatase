import { beforeEach, describe, expect, it } from 'vitest';
import { Time } from '../value-objects/time';
import { Shift } from './shift';
import { WorkDay } from './work-day';

describe('WorkDay Entity', () => {
  let workDay: WorkDay;

  beforeEach(() => {
    workDay = WorkDay.restore({
      id: 'work-day-1',
      barberId: 'barber-1',
      shifts: [
        Shift.create({
          workDayId: 'work-day-1',
          start: Time.create('08:00'),
          end: Time.create('17:00'),
        }),
      ],
      weekday: 1,
    });
  });

  it('should create a WorkDay with valid props using .create', () => {
    const workDay = WorkDay.create({
      barberId: 'barber-1',
      weekday: 1,
      shifts: [
        Shift.create({
          workDayId: 'work-day-1',
          start: Time.create('08:00'),
          end: Time.create('17:00'),
        }),
      ],
    });

    expect(workDay).toBeInstanceOf(WorkDay);
  });

  it('should restore a WorkDay with valid props using .restore', () => {
    expect(workDay).toBeInstanceOf(WorkDay);
  });

  it('should throw InvalidWeekdayError if weekday is less than 0', () => {
    expect(() => {
      WorkDay.restore({
        ...workDay.toJSON(),
        weekday: -1,
      });
    }).toThrow();
  });

  it('should throw InvalidWeekdayError if weekday is greater than 6', () => {
    expect(() => {
      WorkDay.restore({
        ...workDay.toJSON(),
        weekday: 7,
      });
    }).toThrow();
  });

  it('should throw MissingShiftError if shifts array is empty', () => {
    expect(() => {
      WorkDay.restore({
        ...workDay.toJSON(),
        shifts: [],
      });
    }).toThrow();
  });

  it('should throw DuplicateShiftError if shifts contain duplicates (by reference)', () => {
    expect(() => {
      WorkDay.restore({
        ...workDay.toJSON(),
        shifts: [workDay.shifts[0], workDay.shifts[0]],
      });
    }).toThrow();
  });
});

import { buildAvailability } from '@/test/builders/build-availability';
import { beforeEach, describe, expect, it } from 'vitest';
import { Shift } from '../entities/shift';
import { WorkDay } from '../entities/work-day';
import { Time } from '../value-objects/time';
import { Barber } from './barber';

describe('Barber Aggregate Root', () => {
  let barber: Barber;

  beforeEach(() => {
    const { workDays } = buildAvailability('barber-1');

    barber = Barber.restore({
      id: 'barber-1',
      fullName: 'John Doe',
      services: ['Beard Trim', 'Modern Haircut'],
      workDays,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should create a Barber with valid props using .create', () => {
    expect(
      Barber.create({
        ...barber.toJSON(),
      }),
    ).toBeInstanceOf(Barber);
  });

  it('should restore a Barber with valid props using .restore', () => {
    expect(
      Barber.restore({
        ...barber.toJSON(),
      }),
    ).toBeInstanceOf(Barber);
  });

  it('should throw EmptyServicesError if services list is empty', () => {
    expect(() => {
      Barber.restore({
        ...barber.toJSON(),
        services: [],
      });
    }).toThrow();
  });

  it('should throw DuplicateServiceError if services list has duplicates', () => {
    expect(() => {
      Barber.restore({
        ...barber.toJSON(),
        services: ['Beard Trim', 'Beard Trim'],
      });
    }).toThrow();
  });

  it('should throw MissingWorkDayError if workDays list is empty', () => {
    expect(() => {
      Barber.restore({
        ...barber.toJSON(),
        workDays: [],
      });
    }).toThrow();
  });

  it('should throw DuplicateWorkDayError if workDays list has duplicates (by reference)', () => {
    expect(() => {
      Barber.restore({
        ...barber.toJSON(),
        workDays: [barber.workDays[0], barber.workDays[0]],
      });
    }).toThrow();
  });

  it('should confirm service availability using offersService', () => {
    expect(barber.offersService('Beard Trim')).toBe(true);
    expect(barber.offersService('Kids Haircut')).toBe(false);
  });

  it('should add a new service and emit event', () => {
    barber.addService('Kids Haircut');
    expect(barber.pullEvents()).toEqual(['barber.service.added']);
  });

  it('should throw DuplicateServiceError when adding a duplicate service', () => {
    expect(() => {
      barber.addService('Beard Trim');
    }).toThrow();
  });

  it('should add a new workDay and emit event', () => {
    barber.addWorkDay(
      WorkDay.create({
        barberId: 'barber-1',
        weekday: 1,
        shifts: [
          Shift.create({
            workDayId: 'work-day-1',
            start: Time.create('08:00'),
            end: Time.create('17:00'),
          }),
        ],
      }),
    );
    expect(barber.pullEvents()).toEqual(['barber.workDay.added']);
  });
});

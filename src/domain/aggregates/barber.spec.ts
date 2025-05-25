import { beforeEach, describe, expect, it } from 'vitest';
import { buildAvailability } from '../../test/builders/build-barber-availability';
import { Barber } from './barber';

describe('Barber Aggregate Root', () => {
  let barber: Barber;

  beforeEach(() => {
    const { availableDays, timeSlots } = buildAvailability('barber-1');

    barber = Barber.restore({
      id: 'barber-1',
      fullName: 'John Doe',
      services: ['Beard Trim', 'Modern Haircut'],
      availableDays,
      timeSlots,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should ensure services is not empty', () => {
    expect(() => {
      Barber.restore({
        ...barber.toJSON(),
        services: [],
      });
    }).toThrow();
  });

  it('should ensure services does not contain duplicates', () => {
    expect(() => {
      Barber.restore({
        ...barber.toJSON(),
        services: ['Beard Trim', 'Beard Trim'],
      });
    }).toThrow();
  });

  it('should ensure at least one availableDay exists', () => {
    expect(() => {
      Barber.restore({
        ...barber.toJSON(),
        availableDays: [],
      });
    }).toThrow();
  });

  it('should ensure at least one timeSlot exists', () => {
    expect(() => {
      Barber.restore({
        ...barber.toJSON(),
        timeSlots: [],
      });
    }).toThrow();
  });

  it('should not allow more than one availableDay with the same weekday', () => {
    expect(() => {
      Barber.restore({
        ...barber.toJSON(),
        availableDays: [...barber.availableDays, barber.availableDays[0]],
      });
    }).toThrow();
  });

  it('should not allow more than one timeSlot with the same availableDayId', () => {
    expect(() => {
      Barber.restore({
        ...barber.toJSON(),
        timeSlots: [...barber.timeSlots, barber.timeSlots[0]],
      });
    }).toThrow();
  });

  it('should keep availableDays and timeSlots consistent (no orphaned slots)', () => {
    expect(barber.availableDays.length).toBe(barber.timeSlots.length);
  });
});

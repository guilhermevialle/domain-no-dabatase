import { beforeEach, describe, expect, it } from 'vitest';
import { Time } from '../value-objects/time';
import { TimeSlot } from './time-slot';

describe('TimeSlot Entity', () => {
  let timeSlot: TimeSlot;
  let now: Date;

  beforeEach(() => {
    now = new Date();
    timeSlot = TimeSlot.create({
      availableDayId: 'available-day-1',
      start: Time.create('08:00'),
      end: Time.create('17:00'),
    });
  });

  it('should create a TimeSlot with generated id if not provided', () => {
    expect(timeSlot.id).toBeDefined();
  });

  it('should throw if start time and end time are the same', () => {
    expect(() => {
      TimeSlot.restore({
        ...timeSlot.toJSON(),
        start: Time.create('08:00'),
        end: Time.create('08:00'),
      });
    }).toThrow();
  });

  it('should throw if start time is after end time', () => {
    expect(() => {
      TimeSlot.restore({
        ...timeSlot.toJSON(),
        start: Time.create('17:00'),
        end: Time.create('08:00'),
      });
    }).toThrow();
  });
});

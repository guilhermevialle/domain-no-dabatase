import { beforeEach, describe, expect, it } from 'vitest';
import { Time } from '../value-objects/time';
import { Shift } from './shift';

describe('Shift Entity', () => {
  let shift: Shift;
  let now: Date;

  beforeEach(() => {
    now = new Date();
    shift = Shift.create({
      workDayId: 'work-day-1',
      start: Time.create('08:00'),
      end: Time.create('17:00'),
    });
  });

  it('should create a Shift with generated id if not provided', () => {
    expect(shift.id).toBeDefined();
  });

  it('should throw if start time and end time are the same', () => {
    expect(() => {
      Shift.restore({
        ...shift.toJSON(),
        start: Time.create('08:00'),
        end: Time.create('08:00'),
      });
    }).toThrow();
  });

  it('should throw if start time is after end time', () => {
    expect(() => {
      Shift.restore({
        ...shift.toJSON(),
        start: Time.create('17:00'),
        end: Time.create('08:00'),
      });
    }).toThrow();
  });
});

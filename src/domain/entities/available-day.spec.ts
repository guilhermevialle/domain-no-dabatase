import { beforeEach, describe, expect, it } from 'vitest';
import { AvailableDay } from './available-day';

describe('AvailableDay Entity', () => {
  let availableDay: AvailableDay;

  beforeEach(() => {
    availableDay = new AvailableDay({
      id: 'available-day-1',
      barberId: 'barber-1',
      weekday: 1,
    });
  });

  it('should create an AvailableDay with generated id if not provided', () => {
    expect(availableDay.id).toBeDefined();
  });

  it('should throw if weekday is less than 0', () => {
    expect(() => {
      new AvailableDay({
        ...availableDay.toJSON(),
        weekday: -1,
      });
    }).toThrow();
  });

  it('should throw if weekday is greater than 6', () => {
    expect(() => {
      new AvailableDay({
        ...availableDay.toJSON(),
        weekday: 7,
      });
    }).toThrow();
  });
});

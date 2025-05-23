import { beforeEach, describe, expect, it } from 'vitest';
import { Barber } from './barber';

describe('Barber Entity', () => {
  let barber: Barber;

  beforeEach(() => {
    barber = Barber.restore({
      id: 'barber-1',
      fullName: 'John Doe',
      since: new Date('2020-01-01'),
      services: ['Beard Trim', 'Clean Shave'],
    });
  });

  it('should throw if no services are provided', () => {
    expect(() => {
      Barber.restore({
        ...barber.toJSON(),
        services: [],
      });
    }).toThrow();
  });

  it('should throw if services contain duplicates', () => {
    expect(() => {
      Barber.restore({
        ...barber.toJSON(),
        services: ['Beard Trim', 'Beard Trim'],
      });
    }).toThrow();
  });

  it('should return true if barber can do the given service', () => {
    expect(barber.canDoService('Beard Trim')).toBe(true);
  });

  it('should return false if barber cannot do the given service', () => {
    expect(barber.canDoService('Kids Haircut')).toBe(false);
  });
});

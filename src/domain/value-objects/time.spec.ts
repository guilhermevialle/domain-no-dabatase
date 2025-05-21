import { describe, expect, it } from 'vitest';
import { Time } from './time';

describe('Time Value Object', () => {
  it('should create a Time from a valid string in HH:mm format', () => {
    const time = new Time('12:00');
    expect(time.value).toBe('12:00');
  });

  it('should create a Time from a valid Date instance', () => {
    const date = new Date('2023-01-01T12:00:00Z');
    const time = new Time(date);
    expect(time.value).toBe('12:00');
  });

  it('should throw if string time format is invalid', () => {
    expect(() => new Time('invalid-time')).toThrow();
  });

  it('should throw if time is outside valid range (e.g., 25:00)', () => {
    expect(() => new Time('25:00')).toThrow();
  });

  it('should return true if current time is before other time', () => {
    const currentTime = new Time('12:00');
    const otherTime = new Time('13:00');
    expect(currentTime.isBefore(otherTime)).toBe(true);
  });

  it('should return false if current time is not before other time', () => {
    const currentTime = new Time('13:00');
    const otherTime = new Time('12:00');
    expect(currentTime.isBefore(otherTime)).toBe(false);
  });

  it('should return true if current time is after other time', () => {
    const currentTime = new Time('13:00');
    const otherTime = new Time('12:00');
    expect(currentTime.isAfter(otherTime)).toBe(true);
  });

  it('should return false if current time is not after other time', () => {
    const currentTime = new Time('12:00');
    const otherTime = new Time('13:00');
    expect(currentTime.isAfter(otherTime)).toBe(false);
  });

  it('should convert time to total minutes correctly', () => {
    const time = new Time('12:00');
    expect(time.toMinutes()).toBe(720);
  });

  it('should expose raw value via value getter', () => {
    const time = new Time('12:00');
    expect(time.value).toBe('12:00');
  });

  it('should expose formatted time string via formatted getter', () => {
    const time = new Time('12:00');
    expect(time.formatted).toBe('12:00');
  });
});

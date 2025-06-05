import { getHours, getMinutes, getSeconds } from 'date-fns';
import { describe, expect, it } from 'vitest';
import { Time } from './time';

describe('Time Value Object', () => {
  // factory validations
  it('should create Time from a valid number of minutes', () => {
    const minutes = 60;
    const time = Time.create(minutes);

    expect(time).toBeInstanceOf(Time);
    expect(time.formatted).toBe('01:00');
    expect(time.toMinutes).toBe(minutes);
    expect(time.toSeconds).toBe(minutes * 60);
  });

  it('should create Time from a valid HH:mm string', () => {
    const HHmm = '08:00';
    const time = Time.create(HHmm);

    expect(time).toBeInstanceOf(Time);
    expect(time.formatted).toBe('08:00');
    expect(time.toMinutes).toBe(480);
    expect(time.toSeconds).toBe(28800);
  });

  it('should create Time from a valid Date object', () => {
    const now = new Date();
    now.setHours(8, 30, 0, 0);

    const time = Time.create(now);

    expect(time).toBeInstanceOf(Time);
    expect(time.formatted).toBe('08:30');
    expect(time.toMinutes).toBe(getHours(now) * 60 + getMinutes(now));
    expect(time.toSeconds).toBe(
      getHours(now) * 3600 + getMinutes(now) * 60 + getSeconds(now),
    );
  });

  it('should throw InvalidDateError when created with an invalid Date', () => {
    expect(() => Time.create(new Date('invalid-date'))).toThrow();
  });

  it('should throw InvalidInputTypeError when created with an unsupported input type', () => {
    expect(() => Time.create('invalid-input')).toThrow();
  });

  it('should throw InvalidInputTypeError when created with an invalid number of minutes', () => {
    expect(() => Time.create(-1)).toThrow();
    expect(() => Time.create(1440)).toThrow();
  });

  // comparison validations
  it('should return true for isBefore when the time is earlier', () => {
    const earlierTime = Time.create('08:00');
    const laterTime = Time.create('09:00');

    expect(earlierTime.isBefore(laterTime)).toBe(true);
  });

  it('should return true for isAfter when the time is later', () => {
    const earlierTime = Time.create('08:00');
    const laterTime = Time.create('09:00');

    expect(laterTime.isAfter(earlierTime)).toBe(true);
  });

  it('should return false for isBefore when the time is the same', () => {
    const time = Time.create('08:00');

    expect(time.isBefore(time)).toBe(false);
  });

  it('should return false for isAfter when the time is the same', () => {
    const time = Time.create('08:00');

    expect(time.isAfter(time)).toBe(false);
  });

  // conversion validations
  it('should convert Time to Date with correct hours and minutes based on reference date', () => {
    const now = new Date();
    const time = Time.create('08:00');
    const convertedDate = time.toDate(now);

    expect(convertedDate.getHours()).toBe(8);
    expect(convertedDate.getMinutes()).toBe(0);
    expect(convertedDate.getSeconds()).toBe(0);
    expect(convertedDate.getDay()).toBe(now.getDay());
  });

  it('should return the correct formatted HH:mm string', () => {
    const time = Time.create('08:00');
    expect(time.formatted).toBe('08:00');
  });

  it('should return the correct value in minutes', () => {
    const time = Time.create('08:00');
    expect(time.toMinutes).toBe(480);
  });

  it('should return the correct value in seconds', () => {
    const time = Time.create('08:00');
    expect(time.toSeconds).toBe(28800);
  });

  it('should get correct hour', () => {
    const time = Time.create('08:00');
    expect(time.hour).toBe(8);
  });

  it('should get correct minute', () => {
    const time = Time.create('08:30');
    expect(time.minute).toBe(30);
  });
});

import { describe, expect, it } from 'vitest';
import { Time } from './time';

describe('Time', () => {
  describe('constructor', () => {
    it('should create a valid Time from string', () => {
      const time = new Time('14:30');
      expect(time.value).toBe('14:30');
    });

    it('should create a valid Time from Date object', () => {
      const date = new Date();
      date.setHours(15);
      date.setMinutes(45);
      date.setSeconds(0);
      date.setMilliseconds(0);

      const time = new Time(date);
      expect(time.value).toBe('15:45');
    });

    it('should throw an error for invalid format', () => {
      expect(() => new Time('14-30')).toThrow('Invalid time format');
      expect(() => new Time('1430')).toThrow('Invalid time format');
      expect(() => new Time('14:3')).toThrow('Invalid time format');
    });

    it('should throw an error for out of range values', () => {
      expect(() => new Time('24:00')).toThrow('Time must be between');
      expect(() => new Time('23:60')).toThrow('Time must be between');
    });
  });

  describe('isValidFormat', () => {
    it('should return true for valid format', () => {
      expect(Time.isValidFormat('00:00')).toBe(true);
      expect(Time.isValidFormat('23:59')).toBe(true);
      expect(Time.isValidFormat('12:30')).toBe(true);
    });

    it('should return false for invalid format', () => {
      expect(Time.isValidFormat('2:30')).toBe(false);
      expect(Time.isValidFormat('12-30')).toBe(false);
      expect(Time.isValidFormat('12:3')).toBe(false);
      expect(Time.isValidFormat('123:30')).toBe(false);
    });
  });

  describe('isUnderThan', () => {
    it('should return true when time is earlier', () => {
      const earlier = new Time('08:30');
      const later = new Time('09:00');
      expect(earlier.isUnderThan(later)).toBe(true);
    });

    it('should return false when time is equal', () => {
      const time1 = new Time('08:30');
      const time2 = new Time('08:30');
      expect(time1.isUnderThan(time2)).toBe(false);
    });

    it('should return false when time is later', () => {
      const earlier = new Time('08:30');
      const later = new Time('09:00');
      expect(later.isUnderThan(earlier)).toBe(false);
    });

    it('should handle edge cases correctly', () => {
      const midnight = new Time('00:00');
      const endOfDay = new Time('23:59');
      expect(midnight.isUnderThan(endOfDay)).toBe(true);
      expect(endOfDay.isUnderThan(midnight)).toBe(false);
    });
  });

  describe('isOverThan', () => {
    it('should return true when time is later', () => {
      const earlier = new Time('08:30');
      const later = new Time('09:00');
      expect(later.isOverThan(earlier)).toBe(true);
    });

    it('should return false when time is equal', () => {
      const time1 = new Time('08:30');
      const time2 = new Time('08:30');
      expect(time1.isOverThan(time2)).toBe(false);
    });

    it('should return false when time is earlier', () => {
      const earlier = new Time('08:30');
      const later = new Time('09:00');
      expect(earlier.isOverThan(later)).toBe(false);
    });

    it('should handle edge cases correctly', () => {
      const midnight = new Time('00:00');
      const endOfDay = new Time('23:59');
      expect(endOfDay.isOverThan(midnight)).toBe(true);
      expect(midnight.isOverThan(endOfDay)).toBe(false);
    });
  });

  describe('toMinutes', () => {
    it('should convert time to minutes correctly', () => {
      expect(new Time('00:00').toMinutes()).toBe(0);
      expect(new Time('01:00').toMinutes()).toBe(60);
      expect(new Time('01:30').toMinutes()).toBe(90);
      expect(new Time('23:59').toMinutes()).toBe(23 * 60 + 59);
    });
  });
});

import { describe, expect, it } from 'vitest'
import { Time } from './time'

describe('Time', () => {
  it('should create a valid time', () => {
    const time = new Time('14:30')
    expect(time.value).toBe('14:30')
  })

  it('should throw if format is invalid', () => {
    expect(() => new Time('2:30')).toThrowError(
      'Invalid time format. Expected HH:MM in 24-hour format.'
    )

    expect(() => new Time('2430')).toThrowError(
      'Invalid time format. Expected HH:MM in 24-hour format.'
    )

    expect(() => new Time('14-30')).toThrowError(
      'Invalid time format. Expected HH:MM in 24-hour format.'
    )
  })

  it('should throw if hour is out of range', () => {
    expect(() => new Time('25:00')).toThrowError(
      'Time must be between 00:00 and 23:59.'
    )
  })

  it('should throw if minutes are out of range', () => {
    expect(() => new Time('23:60')).toThrowError(
      'Time must be between 00:00 and 23:59.'
    )
  })

  it('should accept boundary values', () => {
    expect(new Time('00:00').value).toBe('00:00')
    expect(new Time('23:59').value).toBe('23:59')
  })

  it('should correctly validate format with static method', () => {
    expect(Time.isValidFormat('12:30')).toBe(true)
    expect(Time.isValidFormat('7:30')).toBe(false)
    expect(Time.isValidFormat('1230')).toBe(false)
    expect(Time.isValidFormat('12-30')).toBe(false)
  })
})

import { describe, expect, it } from 'vitest'
import { Time } from './time'

describe('Time Value Object', () => {
  it('should accept a valid string time', () => {
    const time = new Time('14:45')
    expect(time.value).toBe('14:45')
  })

  it('should throw if string time is invalid format', () => {
    expect(() => new Time('2:45')).toThrowError(
      'Invalid time format. Expected HH:MM in 24-hour format.'
    )

    expect(() => new Time('99:99')).toThrowError(
      'Time must be between 00:00 and 23:59.'
    )

    expect(() => new Time('25:00')).toThrowError(
      'Time must be between 00:00 and 23:59.'
    )
  })

  it('should convert valid time to total minutes', () => {
    const time = new Time('02:30')
    expect(time.toMinutes()).toBe(150)
  })

  it('should create a valid time from Date object', () => {
    const date = new Date('2023-01-01T09:15:00')
    const time = new Time(date)
    expect(time.value).toBe('09:15')
  })

  it('should correctly pad hours and minutes from Date', () => {
    const date = new Date('2023-01-01T07:05:00')
    const time = new Time(date)
    expect(time.value).toBe('07:05')
  })

  it('should accept boundary values', () => {
    expect(() => new Time('00:00')).not.toThrow()
    expect(() => new Time('23:59')).not.toThrow()
  })
})

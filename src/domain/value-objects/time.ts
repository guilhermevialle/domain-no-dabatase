import { format, isAfter, isBefore, isValid, parse } from 'date-fns';

export class Time {
  private _value: string;

  constructor(value: string | Date) {
    this._value = this.validate(value);
  }

  private validate(value: string | Date) {
    const timeString = value instanceof Date ? format(value, 'HH:mm') : value;

    if (!Time.isValidFormat(timeString)) {
      throw new Error('Invalid time format. Expected HH:MM in 24-hour format.');
    }

    const date = parse(timeString, 'HH:mm', new Date());

    if (!isValid(date)) {
      throw new Error('Time must be between 00:00 and 23:59.');
    }

    return timeString;
  }

  public isUnderThan(other: Time): boolean {
    const thisDate = parse(this._value, 'HH:mm', new Date());
    const otherDate = parse(other.value, 'HH:mm', new Date());
    return isBefore(thisDate, otherDate);
  }

  public isOverThan(other: Time): boolean {
    const thisDate = parse(this._value, 'HH:mm', new Date());
    const otherDate = parse(other.value, 'HH:mm', new Date());
    return isAfter(thisDate, otherDate);
  }

  static isValidFormat(value: string): boolean {
    return /^\d{2}:\d{2}$/.test(value);
  }

  public toMinutes(): number {
    const [hours, minutes] = this._value.split(':').map(Number);
    return hours * 60 + minutes;
  }

  get value(): string {
    return this._value;
  }
}

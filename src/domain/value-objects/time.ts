import { getHours, getMinutes, isValid } from 'date-fns';
import { z } from 'zod';
import { InvalidDateError, InvalidInputTypeError } from '../errors/shared';

export const numberSchema = z
  .number()
  .int()
  .min(0, { message: 'Time in minutes cannot be negative' })
  .max(1439, { message: 'Time in minutes must be less than 1440' });

export const stringSchema = z
  .string()
  .regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time string must be in HH:mm format (00:00 to 23:59)',
  });

type TimeInput = string | number | Date;

export class Time {
  private input: TimeInput;
  private _minutes: number;

  private constructor(input: TimeInput) {
    this.input = input;
    this._minutes = this.validate();
  }

  private validate(): number {
    if (typeof this.input === 'number') return numberSchema.parse(this.input);

    if (typeof this.input === 'string') {
      const timeStr = stringSchema.parse(this.input);
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    }

    if (this.input instanceof Date) {
      if (!isValid(this.input)) throw new InvalidDateError();

      const hours = getHours(this.input);
      const minutes = getMinutes(this.input);
      return hours * 60 + minutes;
    }

    throw new InvalidInputTypeError();
  }

  static create(input: TimeInput) {
    return new Time(input);
  }

  // public methods
  public isBefore(time: Time): boolean {
    return this._minutes < time._minutes;
  }

  public isAfter(time: Time): boolean {
    return this._minutes > time._minutes;
  }

  public toDate(referenceDate: Date): Date {
    const hours = Math.floor(this._minutes / 60);
    const minutes = this._minutes % 60;
    const date = new Date(referenceDate);

    date.setHours(hours, minutes, 0, 0);

    return date;
  }

  // private methods
  private formatAsHHmm(): string {
    const hours = Math.floor(this._minutes / 60);
    const minutes = this._minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  // getters
  get formatted(): string {
    return this.formatAsHHmm();
  }

  get inMinutes(): number {
    return this._minutes;
  }

  get inSeconds(): number {
    return this._minutes * 60;
  }

  get minute(): number {
    return this._minutes % 60;
  }

  get hour(): number {
    return Math.floor(this._minutes / 60);
  }
}

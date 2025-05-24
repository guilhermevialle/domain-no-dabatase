import { isAfter, isBefore, isValid, parse } from 'date-fns';

export class Time {
  private _value: string;

  private constructor(value: string | Date) {
    this._value = this.validateAndNormalize(value);
  }

  private validateAndNormalize(value: string | Date): string {
    let timeString: string;
    if (value instanceof Date) {
      const hours = String(value.getUTCHours()).padStart(2, '0');
      const minutes = String(value.getUTCMinutes()).padStart(2, '0');
      timeString = `${hours}:${minutes}`;
    } else {
      timeString = value;
    }

    if (!Time.isValidFormat(timeString)) {
      throw new Error(
        'Formato de hora inválido. Esperado HH:mm no formato 24 horas.',
      );
    }

    const date = parse(timeString, 'HH:mm', new Date());
    if (!isValid(date)) {
      throw new Error('A hora deve estar entre 00:00 e 23:59.');
    }

    return timeString;
  }

  static create(value: string | Date): Time {
    return new Time(value);
  }

  isBefore(other: Time): boolean {
    return isBefore(
      parse(this._value, 'HH:mm', new Date()),
      parse(other.value, 'HH:mm', new Date()),
    );
  }

  isAfter(other: Time): boolean {
    return isAfter(
      parse(this._value, 'HH:mm', new Date()),
      parse(other.value, 'HH:mm', new Date()),
    );
  }

  public toDate(date: Date = new Date()) {
    return parse(this._value, 'HH:mm', date);
  }

  static isValidFormat(value: string): boolean {
    return /^\d{2}:\d{2}$/.test(value) && value >= '00:00' && value <= '23:59';
  }

  toMinutes(): number {
    const [hours, minutes] = this._value.split(':').map(Number);
    return hours * 60 + minutes;
  }

  get value(): string {
    return this._value;
  }

  get formatted(): string {
    return this._value;
  }
}

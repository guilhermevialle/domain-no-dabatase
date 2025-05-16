export class Time {
  private _value: string

  constructor(value: string) {
    if (!Time.isValidFormat(value)) {
      throw new Error('Invalid time format. Expected HH:MM in 24-hour format.')
    }

    const [hours, minutes] = value.split(':').map(Number)

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      throw new Error('Time must be between 00:00 and 23:59.')
    }

    this._value = value
  }

  static isValidFormat(value: string): boolean {
    return /^\d{2}:\d{2}$/.test(value)
  }

  public toMinutes(): number {
    const [hours, minutes] = this._value.split(':').map(Number)
    return hours * 60 + minutes
  }

  get value() {
    return this._value
  }
}

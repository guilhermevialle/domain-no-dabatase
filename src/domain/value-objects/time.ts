import { isAfter, isBefore, isValid, parse } from 'date-fns';

export class Time {
  private _value: string;

  constructor(value: string | Date) {
    this._value = this.validateAndNormalize(value);
  }

  private validateAndNormalize(value: string | Date): string {
    // Normaliza o valor para string no formato HH:mm
    let timeString: string;
    if (value instanceof Date) {
      // Usa UTC para ignorar fuso horário local
      const hours = String(value.getUTCHours()).padStart(2, '0');
      const minutes = String(value.getUTCMinutes()).padStart(2, '0');
      timeString = `${hours}:${minutes}`;
    } else {
      timeString = value;
    }

    // Valida o formato da string
    if (!Time.isValidFormat(timeString)) {
      throw new Error(
        'Formato de hora inválido. Esperado HH:mm no formato 24 horas.',
      );
    }

    // Valida se a hora é válida
    const date = parse(timeString, 'HH:mm', new Date());
    if (!isValid(date)) {
      throw new Error('A hora deve estar entre 00:00 e 23:59.');
    }

    return timeString;
  }

  // Verifica se esta hora é anterior a outra
  isBefore(other: Time): boolean {
    return isBefore(
      parse(this._value, 'HH:mm', new Date()),
      parse(other.value, 'HH:mm', new Date()),
    );
  }

  // Verifica se esta hora é posterior a outra
  isAfter(other: Time): boolean {
    return isAfter(
      parse(this._value, 'HH:mm', new Date()),
      parse(other.value, 'HH:mm', new Date()),
    );
  }

  // Valida o formato da string (HH:mm)
  static isValidFormat(value: string): boolean {
    return /^\d{2}:\d{2}$/.test(value) && value >= '00:00' && value <= '23:59';
  }

  // Converte a hora para minutos totais
  toMinutes(): number {
    const [hours, minutes] = this._value.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Getter para o valor
  get value(): string {
    return this._value;
  }

  // Getter para formato legível
  get formatted(): string {
    return this._value;
  }
}

import { z } from 'zod';

const VALID_DDDS = [
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35,
  37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64,
  65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88,
  89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
] as const;

type ValidDDD = (typeof VALID_DDDS)[number];

const brazilPhoneSchema = z.string().refine(
  (value) => {
    const digits = value.replace(/\D/g, '');
    const phone = digits.startsWith('55') ? digits.slice(2) : digits;
    const ddd = parseInt(phone.slice(0, 2), 10);
    const number = phone.slice(2);

    return (
      phone.length >= 10 &&
      phone.length <= 11 &&
      VALID_DDDS.includes(ddd as ValidDDD) &&
      number.length >= 8 &&
      number.length <= 9
    );
  },
  {
    message:
      'Número de telefone brasileiro inválido. Deve conter um DDD válido e 8-9 dígitos após o DDD.',
  },
);

const normalizePhone = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  return digits.startsWith('55') ? digits : `55${digits}`;
};

export class BrazilPhone {
  private _value: string;

  private constructor(value: string) {
    this._value = brazilPhoneSchema.parse(normalizePhone(value));
  }

  static create(value: string): BrazilPhone {
    return new BrazilPhone(value);
  }

  get value(): string {
    return this._value;
  }

  get formatted(): string {
    const digits = this._value;
    const ddd = digits.slice(2, 4);
    const number = digits.slice(4);
    const isNineDigits = number.length === 9;
    const firstPart = isNineDigits ? number.slice(0, 5) : number.slice(0, 4);
    const secondPart = isNineDigits ? number.slice(5) : number.slice(4);
    return `+55 (${ddd}) ${firstPart}-${secondPart}`;
  }
}

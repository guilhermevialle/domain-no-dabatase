import { z } from 'zod';

const emailSchema = z
  .string()
  .email()
  .transform((email) => email.toLowerCase());

export class Email {
  private _value: string;

  private constructor(value: string) {
    const result = emailSchema.safeParse(value);

    if (!result.success) {
      throw new Error('Invalid email.');
    }

    this._value = result.data;
  }

  static create(email: string) {
    return new Email(email);
  }

  get value() {
    return this._value;
  }
}

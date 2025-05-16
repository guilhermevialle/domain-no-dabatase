import { z } from 'zod'

const validDDDs = [
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35,
  37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64,
  65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88,
  89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
]

const brazilPhoneSchema = z.string().refine(
  (value) => {
    const digitsOnly = value.replace(/\D/g, '')
    const hasCountryCode = digitsOnly.startsWith('55')
    const phoneNumber = hasCountryCode ? digitsOnly.substring(2) : digitsOnly
    const ddd = parseInt(phoneNumber.substring(0, 2))

    if (phoneNumber.length < 10 || phoneNumber.length > 11) return false
    if (!validDDDs.includes(ddd)) return false

    const numberPart = phoneNumber.substring(2)
    return numberPart.length >= 8 && numberPart.length <= 9
  },
  {
    message:
      'Invalid Brazilian phone number. Must have a valid DDD and 8-9 digits after DDD.',
  }
)

export class BrazilPhone {
  private _value: string

  constructor(value: string) {
    brazilPhoneSchema.parse(value)
    this._value = this.normalize(value)
  }

  private normalize(value: string): string {
    const digitsOnly = value.replace(/\D/g, '')
    const normalized = digitsOnly.startsWith('55')
      ? digitsOnly
      : `55${digitsOnly}`
    return normalized
  }

  get value(): string {
    return this._value
  }
}

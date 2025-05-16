import { z } from 'zod'

const digitsOnly = (input: string) => input.replace(/\D/g, '')

const rawPhoneSchema = z
  .string()
  .transform(digitsOnly)
  .refine(
    (val) => {
      if (val.startsWith('55')) {
        val = val.slice(2)
      }

      return /^\d{10,11}$/.test(val)
    },
    {
      message: 'Invalid Brazilian phone number format',
    }
  )
  .transform((val) => {
    return val.startsWith('55') ? `+${val}` : `+55${val}`
  })

export class Phone {
  private _value: string

  constructor(value: string) {
    const result = rawPhoneSchema.safeParse(value)

    if (!result.success) {
      throw new Error('Invalid phone number.')
    }

    this._value = result.data
  }

  get value() {
    return this._value
  }
}

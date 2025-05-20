import { describe, expect, it } from 'vitest'
import { Rating } from './Rating'

describe('Rating entity', () => {
  it('should create a valid rating with required fields and default comment', () => {
    const rating = new Rating({
      appointmentId: 'appointment-1',
      barberId: 'barber-1',
      customerId: 'customer-1',
      rating: 4,
    })

    expect(rating).toBeInstanceOf(Rating)
    expect(rating.rating).toBe(4)
    expect(rating.comment).toBe('') // default empty string
    expect(rating.appointmentId).toBe('appointment-1')
  })

  it('should create a rating with comment', () => {
    const rating = new Rating({
      appointmentId: 'appointment-1',
      barberId: 'barber-1',
      customerId: 'customer-1',
      rating: 5,
      comment: 'Great service!',
    })

    expect(rating.comment).toBe('Great service!')
  })

  it('should throw if rating is below 1', () => {
    expect(() => {
      new Rating({
        appointmentId: 'a',
        barberId: 'b',
        customerId: 'c',
        rating: 0,
      })
    }).toThrow('Rating must be between 1 and 5.')
  })

  it('should throw if rating is above 5', () => {
    expect(() => {
      new Rating({
        appointmentId: 'a',
        barberId: 'b',
        customerId: 'c',
        rating: 6,
      })
    }).toThrow('Rating must be between 1 and 5.')
  })

  it('should throw if comment is longer than 255 characters', () => {
    const longComment = 'a'.repeat(256)

    expect(() => {
      new Rating({
        appointmentId: 'a',
        barberId: 'b',
        customerId: 'c',
        rating: 3,
        comment: longComment,
      })
    }).toThrow('Comment must be under 255 characters.')
  })
})

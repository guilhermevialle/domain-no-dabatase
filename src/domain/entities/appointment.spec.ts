import { addMinutes, subMinutes } from 'date-fns';
import { beforeEach, describe, expect, it } from 'vitest';
import { Time } from '../value-objects/time';
import { Appointment } from './appointment';

describe('Appointment Entity', () => {
  let now: Date;
  let appointment: Appointment;

  beforeEach(() => {
    now = new Date();
    appointment = new Appointment({
      barberId: 'barber-1',
      customerId: 'customer-1',
      priceInCents: 3000,
      service: 'Kids Haircut',
      startAt: addMinutes(now, 10),
    });
  });

  it('should create an appointment successfully', () => {
    expect(appointment).toBeTruthy();
    expect(appointment.status).toBe('SCHEDULED');
    expect(appointment.endAt).toEqual(addMinutes(now, 10 + 30));
    expect(appointment.duration).toBe(30);
    expect(appointment.priceInCents).toBe(3000);
    expect(appointment.barberId).toBe('barber-1');
    expect(appointment.customerId).toBe('customer-1');
    expect(appointment.service).toBe('Kids Haircut');
    expect(appointment.startAt).toEqual(addMinutes(now, 10));
  });

  it('should reject invalid duration (not divisible by 30)', () => {
    expect(() => {
      new Appointment({
        ...appointment.toJSON(),
        duration: 15,
      });
    }).toThrow();
  });

  it('should reject appointments scheduled in the past', () => {
    expect(() => {
      new Appointment({
        ...appointment.toJSON(),
        startAt: subMinutes(now, 10),
      });
    }).toThrow();
  });

  it('should allow cancellation if more than 10 minutes before start', () => {
    expect(
      new Appointment({
        ...appointment.toJSON(),
        startAt: addMinutes(now, 11),
      }).cancel(),
    );
  });

  it('should prevent cancellation if less than 10 minutes before start', () => {
    expect(() => {
      new Appointment({
        ...appointment.toJSON(),
        startAt: addMinutes(now, 9),
      }).cancel();
    }).toThrow();
  });

  it('should finish appointment and mark as FINISHED', () => {
    appointment.finish();
    expect(appointment.status).toBe('FINISHED');
  });

  it('should reschedule appointment if start date is valid and more than 10 minutes ahead', () => {
    appointment.reschedule(addMinutes(now, 10));
  });

  it('should prevent rescheduling if start date is in the past', () => {
    expect(() => {
      appointment.reschedule(subMinutes(now, 10));
    }).toThrow();
  });

  it('should return correct weekday using getDay()', () => {
    expect(appointment.getDay()).toBe(now.getDay());
  });

  it('should return a Time object using getTime()', () => {
    expect(appointment.getTime()).toBeInstanceOf(Time);
  });
});

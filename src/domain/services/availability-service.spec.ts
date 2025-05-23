import { addMinutes } from 'date-fns';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  appointmentRepo,
  availabilityService,
  availableDayRepo,
  timeSlotRepo,
} from '../../config/depencies';
import { buildAvailability } from '../../test/builders/build-barber-availability';
import {
  buildAppointment,
  buildBarber,
} from '../../test/builders/build-entities';
import { Barber } from '../entities/barber';

describe('Availability Service', () => {
  let barber: Barber;
  let now: Date;

  beforeEach(() => {
    barber = buildBarber('barber-1');
    now = new Date();
  });

  it('Should return false if barber has no available day for the given weekday', async () => {
    const isAvailable = await availabilityService.isBarberAvailable(
      'barber-1',
      new Date('2020-01-01'),
    );

    expect(isAvailable).toBe(false);
  });

  it('Should return false if there is an overlapping appointment at the given time', async () => {
    appointmentRepo.create(
      buildAppointment({
        barberId: 'barber-1',
        customerId: 'customer-1',
        startAt: addMinutes(now, 10),
      }),
    );

    const isAvailable = await availabilityService.isBarberAvailable(
      'barber-1',
      addMinutes(now, 20),
    );

    expect(isAvailable).toBe(false);
  });

  it('Should return true if the given time is inside a defined time slot and no other appointment overlaps that time', async () => {
    const { availableDays, timeSlots } = await buildAvailability(barber.id!, {
      startDay: 0,
      endDay: 6,
      startTime: '00:00',
      endTime: '23:59',
    });

    await availableDayRepo.createMany(availableDays);
    await timeSlotRepo.createMany(timeSlots);

    const isAvailable = await availabilityService.isBarberAvailable(
      'barber-1',
      addMinutes(now, 100),
    );

    expect(isAvailable).toBe(true);
  });

  it('Should return false if the given time is outside all defined time slots for the day, even if no appointment exists', async () => {
    const { availableDays, timeSlots } = buildAvailability('barber-2', {
      startDay: 0,
      endDay: 6,
      startTime: '08:00',
      endTime: '12:00',
    });

    await availableDayRepo.createMany(availableDays);
    await timeSlotRepo.createMany(timeSlots);

    now.setHours(14, 0, 0, 0);

    const isAvailable = await availabilityService.isBarberAvailable(
      'barber-2',
      now,
    );

    expect(isAvailable).toBe(false);
  });

  it('should return true when ignore overlapping provided appointment id', async () => {
    await appointmentRepo.create(
      buildAppointment({
        id: 'appointment-2',
        barberId: 'barber-2',
        customerId: 'customer-2',
        startAt: addMinutes(now, 10),
      }),
    );

    const { availableDays, timeSlots } = buildAvailability('barber-2', {
      startDay: 0,
      endDay: 6,
      startTime: '00:00',
      endTime: '23:59',
    });

    await availableDayRepo.createMany(availableDays);
    await timeSlotRepo.createMany(timeSlots);

    const isAvailable = await availabilityService.isBarberAvailable(
      'barber-2',
      addMinutes(now, 10),
      'appointment-2',
    );

    expect(isAvailable).toBe(true);
  });
});

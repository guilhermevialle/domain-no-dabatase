import { addMinutes } from 'date-fns';
import { beforeEach, describe, expect, it } from 'vitest';
import { buildAvailability } from '../../test/builders/build-availability';
import {
  buildDependencies,
  IBuildDependecies,
} from '../../test/builders/build-dependencies';
import { buildAppointment } from '../../test/builders/build-entities';
import { Barber } from '../aggregates/barber';
import { Time } from '../value-objects/time';

describe('Availability Service', () => {
  let barber: Barber;
  let now: Date;
  let dependecies: IBuildDependecies;

  beforeEach(async () => {
    const { workDays } = buildAvailability('barber-1', {
      intervals: [
        {
          start: Time.create('00:00'),
          end: Time.create('23:59'),
        },
      ],
    });
    barber = Barber.restore({
      id: 'barber-1',
      fullName: 'John Doe',
      services: ['Beard Trim', 'Clean Shave'],
      workDays,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    now = new Date();
    dependecies = buildDependencies();
  });

  it(' should return true if the barber is available on that weekday and shift', async () => {
    await dependecies.barberRepo.create(barber);

    const isAvailable = await dependecies.availabilityService.isBarberAvailable(
      barber.id,
      now,
    );

    expect(isAvailable).toBe(true);
  });

  it('should return false if the barber has no shifts on that weekday', async () => {
    await dependecies.barberRepo.clear();

    const { workDays } = buildAvailability('barber-1', {
      intervals: [
        {
          start: Time.create(addMinutes(now, 5)),
          end: Time.create(addMinutes(now, 65)),
        },
      ],
    });

    const _barber = Barber.restore({
      ...barber.toJSON(),
      workDays,
    });

    await dependecies.barberRepo.create(_barber);

    const isAvailable = await dependecies.availabilityService.isBarberAvailable(
      _barber.id,
      now,
    );
    expect(isAvailable).toBe(false);
  });

  it('should return true if an overlapping appointment is found', async () => {
    const appointment = buildAppointment({
      barberId: 'barber-1',
      customerId: 'customer-1',
      startAt: addMinutes(now, 15),
    });

    await dependecies.barberRepo.create(barber);
    await dependecies.appointmentRepo.create(appointment);

    const isOverlapping =
      await dependecies.availabilityService.isOverlappingByDateAndBarberId(
        'barber-1',
        addMinutes(now, 20),
      );

    expect(isOverlapping).toBe(true);
  });

  it('should return false if no overlapping appointment exists', async () => {
    await dependecies.barberRepo.create(barber);

    const isOverlapping =
      await dependecies.availabilityService.isOverlappingByDateAndBarberId(
        'barber-1',
        addMinutes(now, 20),
      );

    expect(isOverlapping).toBe(false);
  });

  it('should return false if the date is in the past', async () => {
    const isAvailable = await dependecies.availabilityService.isBarberAvailable(
      'barber-1',
      new Date('2023-01-01T12:00:00Z'),
    );

    expect(isAvailable).toBe(false);
  });
});

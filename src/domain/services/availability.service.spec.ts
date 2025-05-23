import { beforeEach, describe, expect, it } from 'vitest';
import { buildAvailability } from '../../test/builders/build-barber-availability';
import { buildBarber } from '../../test/builders/build-entities';
import {
  buildRepositories,
  IBuildRepositories,
} from '../../test/builders/build-repositories';
import {
  buildServices,
  IBuildServices,
} from '../../test/builders/build-services';
import { Barber } from '../entities/barber';

describe('BarberAvailability Service', () => {
  let repos: IBuildRepositories;
  let services: IBuildServices;
  let now: Date;
  let barber: Barber;

  beforeEach(async () => {
    barber = buildBarber('barber-1');
    now = new Date();
    repos = buildRepositories();
    services = buildServices();
  });

  it('should return true if barber is available', async () => {
    await repos.barberRepo.create(barber);

    const { availableDays, timeSlots } = buildAvailability(barber.id!, {});

    await repos.availableDayRepo.createMany(availableDays);
    await repos.timeSlotRepo.createMany(timeSlots);

    const isAvailable = await services.availability.isBarberAvailable(
      barber.id!,
      now,
    );

    expect(isAvailable).toBe(true);
  });
});

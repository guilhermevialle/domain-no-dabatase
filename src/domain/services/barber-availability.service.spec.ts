import { addMinutes } from 'date-fns';
import { beforeEach, describe, expect, it } from 'vitest';
import { buildBarber } from '../../test/builders/build-entities';
import {
  buildRepositories,
  IBuildRepositories,
} from '../../test/builders/build-repositories';
import {
  buildServices,
  IBuildServices,
} from '../../test/builders/build-services';

describe('BarberAvailability Service', () => {
  let repos: IBuildRepositories;
  let services: IBuildServices;
  let now: Date;

  beforeEach(async () => {
    now = new Date();
    repos = buildRepositories();
    services = buildServices();
  });

  it('should return true if barber is available', async () => {
    await repos.barberRepo.create(buildBarber('barber-1'));

    const isAvailable = await services.barberAvailability.isAvailable(
      'barber-1',
      now,
      addMinutes(now, 30),
    );

    expect(isAvailable).toBe(true);
  });
});

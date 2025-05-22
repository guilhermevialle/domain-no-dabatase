import { beforeEach, describe, expect, it } from 'vitest';
import { AvailableDay } from '../../../domain/entities/available-day';
import { IAvailableDayRepository } from '../../../interfaces/repositories/available-day-repository';
import { buildAvailableDay } from '../../../test/builders/build-entities';
import { InMemoryAvailableDayRepository } from './in-memory-available-day-repository';

describe('InMemoryAvailableDayRepository', () => {
  let availableDayRepo: IAvailableDayRepository;
  let now: Date;
  let availableDay: AvailableDay;

  beforeEach(() => {
    now = new Date();

    availableDay = new AvailableDay({
      id: 'available-day-1',
      barberId: 'barber-1',
      weekday: 1,
    });
    availableDayRepo = new InMemoryAvailableDayRepository();
  });

  it('should store a new available day', async () => {
    await availableDayRepo.create(availableDay);

    const availableDays = await availableDayRepo.findManyByBarberId('barber-1');

    expect(availableDays).toEqual([availableDay]);
  });

  it('should return all available days for a given barber', async () => {
    let availableDay = buildAvailableDay('barber-1');
    await availableDayRepo.create(availableDay);
    const availableDays = await availableDayRepo.findManyByBarberId('barber-1');

    expect(availableDays).toEqual([availableDay]);
  });

  it('should return an empty array if the barber has no available days', async () => {
    const availableDays = await availableDayRepo.findManyByBarberId('barber-1');

    expect(availableDays).toEqual([]);
  });

  it('should return the available day for a given barber and weekday', async () => {
    await availableDayRepo.create(availableDay);

    await expect(availableDayRepo.findByWeekdayAndBarberId('barber-1', 1));
  });

  it('should return null if no matching barber and weekday is found', async () => {
    await expect(
      availableDayRepo.findByWeekdayAndBarberId('barber-1', 1),
    ).resolves.toBe(null);
  });
});

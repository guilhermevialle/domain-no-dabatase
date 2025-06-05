import { NonEmptyArray } from '@/@types';
import { Barber } from '@/domain/aggregates/barber';
import { WorkDay } from '@/domain/entities/work-day';
import { IBarberRepository } from '@/interfaces/repositories/barber-repository.interface';
import { buildAvailability } from '@/test/builders/build-availability';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryBarberRepository } from './in-memory-barber.repository';

describe('InMemory Barber Repository', () => {
  let baberRepo: IBarberRepository;
  let barber: Barber;

  beforeEach(() => {
    baberRepo = new InMemoryBarberRepository();
    const { workDays } = buildAvailability('barber-1');
    barber = Barber.restore({
      id: 'barber-1',
      fullName: 'John Doe',
      services: ['Beard Trim', 'Clean Shave'],
      workDays: workDays as NonEmptyArray<WorkDay>,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should store a new barber', async () => {
    await baberRepo.create(barber);

    const barberFound = await baberRepo.findById(barber.id);

    expect(barberFound).toEqual(barber);
  });

  it('should update an existing barber', async () => {
    await baberRepo.create(barber);

    await baberRepo.update(
      Barber.restore({
        ...barber.toJSON(),
        fullName: 'John Doe Jr.',
      }),
    );

    expect((await baberRepo.findById(barber.id!))?.fullName).toBe(
      'John Doe Jr.',
    );
  });

  it('should return a barber by id if it exists', async () => {
    await baberRepo.create(barber);

    expect(await baberRepo.findById(barber.id)).toEqual(barber);
  });

  it('should return null if no barber is found with the given id', async () => {
    await expect(baberRepo.findById('invalid-id')).resolves.toBe(null);
  });
});

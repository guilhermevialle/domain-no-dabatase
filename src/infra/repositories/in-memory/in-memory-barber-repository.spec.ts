import { beforeEach, describe, expect, it } from 'vitest';
import { Barber } from '../../../domain/entities/barber';
import { IBarberRepository } from '../../../interfaces/repositories/barber-repository';
import { InMemoryBarberRepository } from './in-memory-barber-repository';

describe('InMemory Barber Repository', () => {
  let baberRepo: IBarberRepository;
  let barber: Barber;

  beforeEach(() => {
    baberRepo = new InMemoryBarberRepository();
    barber = Barber.restore({
      id: 'barber-1',
      fullName: 'John Doe',
      services: ['Beard Trim', 'Clean Shave'],
      since: new Date('2020-01-01'),
    });
  });

  it('should store a new barber', async () => {
    await baberRepo.create(barber);

    const barberFound = await baberRepo.findById(barber.id!);

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

    expect(await baberRepo.findById(barber.id!)).toEqual(barber);
  });

  it('should return null if no barber is found with the given id', async () => {
    await expect(baberRepo.findById('invalid-id')).resolves.toBe(null);
  });
});

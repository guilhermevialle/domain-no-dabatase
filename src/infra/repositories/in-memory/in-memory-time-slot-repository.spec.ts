import { beforeEach, describe, expect, it } from 'vitest';
import { TimeSlot } from '../../../domain/entities/time-slot';
import { Time } from '../../../domain/value-objects/time';
import { ITimeSlotRepository } from '../../../interfaces/repositories/time-slot-repository';
import { InMemoryTimeSlotRepository } from './in-memory-time-slot-repository';

describe('InMemory TimeSlot Repository', () => {
  let timeSlotRepo: ITimeSlotRepository;
  let timeSlot: TimeSlot;

  beforeEach(() => {
    timeSlotRepo = new InMemoryTimeSlotRepository();
    timeSlot = TimeSlot.create({
      availableDayId: 'available-day-1',
      start: Time.create('08:00'),
      end: Time.create('17:30'),
    });
  });

  it('should store a new time slot', async () => {
    await timeSlotRepo.create(timeSlot);

    await expect(
      timeSlotRepo.findManyByAvailableDayId('available-day-1'),
    ).resolves.toEqual([timeSlot]);
  });

  it('should return all time slots for a given availableDayId', async () => {
    await timeSlotRepo.create(timeSlot);
    const slots =
      await timeSlotRepo.findManyByAvailableDayId('available-day-1');

    expect(slots).toEqual([timeSlot]);
  });

  it('should return an empty array if no time slots exist for the given availableDayId', async () => {
    await expect(
      timeSlotRepo.findManyByAvailableDayId('non-existing-id'),
    ).resolves.toEqual([]);
  });
});

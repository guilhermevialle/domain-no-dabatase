import { addMinutes } from 'date-fns';
import { beforeEach, describe, expect, it } from 'vitest';
import { buildAvailability } from '../../../test/builders/build-barber-availability';
import {
  buildDependencies,
  IBuildDependecies,
} from '../../../test/builders/build-dependencies';
import { buildAppointment } from '../../../test/builders/build-entities';
import { RescheduleAppointment } from './reschedule-appointment';

describe('RescheduleAppointment Use Case', () => {
  let useCase: RescheduleAppointment;
  let dependencies: IBuildDependecies;
  let now: Date;

  beforeEach(() => {
    now = new Date();
    dependencies = buildDependencies();
    useCase = new RescheduleAppointment(
      dependencies.appointmentRepo,
      dependencies.availabilityService,
    );
  });

  it('Should throw if appointment does not exist', async () => {
    await expect(() =>
      useCase.execute({
        id: 'invalid-id',
        startAt: now,
      }),
    ).rejects.toThrowError();
  });

  it('Should throw if barber is not available at the new time', async () => {
    await expect(() =>
      useCase.execute({
        id: 'valid-id',
        startAt: now,
      }),
    ).rejects.toThrowError();
  });

  it('Should reschedule the appointment to the new time if the barber is available', async () => {
    await dependencies.appointmentRepo.create(
      buildAppointment({
        id: 'a-1',
        barberId: 'b-1',
        customerId: 'c-1',
        startAt: addMinutes(now, 10),
      }),
    );

    const { availableDays, timeSlots } = buildAvailability('b-1');

    await dependencies.availableDayRepo.createMany(availableDays);
    await dependencies.timeSlotRepo.createMany(timeSlots);

    const result = await useCase.execute({
      id: 'a-1',
      startAt: addMinutes(now, 21),
    });

    expect(result.startAt).toEqual(addMinutes(now, 21));
  });
});

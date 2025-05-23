import { beforeEach, describe, expect, it } from 'vitest';
import { Barber } from '../../../domain/entities/barber';
import {
  buildDependencies,
  IBuildDependecies,
} from '../../../test/builders/build-dependencies';
import {
  buildAppointment,
  buildBarber,
} from '../../../test/builders/build-entities';
import { ListBarberAppointments } from './list-barber-appointments';

describe('ListBarberAppointments Use Case', () => {
  let dependencies: IBuildDependecies;
  let barber: Barber;
  let useCase: ListBarberAppointments;

  beforeEach(() => {
    dependencies = buildDependencies();
    barber = buildBarber('barber-1');
    useCase = new ListBarberAppointments(
      dependencies.appointmentRepo,
      dependencies.barberRepo,
    );
  });

  it('should throw an error if the barber is not found', async () => {
    await expect(() =>
      useCase.execute({ id: 'invalid-id' }),
    ).rejects.toThrowError();
  });

  it('should return the list of appointments for the given barber id', async () => {
    await dependencies.barberRepo.create(barber);
    await dependencies.appointmentRepo.createMany([
      buildAppointment({
        barberId: barber.id!,
        customerId: 'customer-1',
      }),
      buildAppointment({
        barberId: barber.id!,
        customerId: 'customer-1',
      }),
    ]);

    const appointments = await useCase.execute({ id: barber.id! });

    expect(appointments).toHaveLength(2);
  });
});

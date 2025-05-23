import { beforeEach, describe, expect, it } from 'vitest';
import { Barber } from '../../../domain/entities/barber';
import {
  buildAppointment,
  buildBarber,
} from '../../../test/builders/build-entities';
import {
  buildRepositories,
  IBuildRepositories,
} from '../../../test/builders/build-repositories';
import { ListBarberAppointments } from './list-barber-appointments';

describe('ListBarberAppointments Use Case', () => {
  let repos: IBuildRepositories;
  let barber: Barber;
  let useCase: ListBarberAppointments;

  beforeEach(() => {
    repos = buildRepositories();
    barber = buildBarber('barber-1');
    useCase = new ListBarberAppointments(
      repos.appointmentRepo,
      repos.barberRepo,
    );
  });

  it('should throw an error if the barber is not found', async () => {
    await expect(() =>
      useCase.execute({ id: 'invalid-id' }),
    ).rejects.toThrowError();
  });

  it('should return the list of appointments for the given barber id', async () => {
    await repos.barberRepo.create(barber);
    await repos.appointmentRepo.createMany([
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

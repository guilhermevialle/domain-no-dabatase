import { beforeEach, describe, expect, it } from 'vitest';
import { Appointment } from '../../../domain/entities/appointment';
import {
  buildDependencies,
  IBuildDependecies,
} from '../../../test/builders/build-dependencies';
import { buildAppointment } from '../../../test/builders/build-entities';
import { CancelAppointment } from './cancel-appointment';

describe('CancelAppointment Use Case', () => {
  let useCase: CancelAppointment;
  let dependecies: IBuildDependecies;
  let appointment: Appointment;

  beforeEach(() => {
    dependecies = buildDependencies();
    appointment = buildAppointment({
      barberId: 'barber-1',
      customerId: 'customer-1',
    });
    useCase = new CancelAppointment(dependecies.appointmentRepo);
  });

  it('should throw an error if the appointment is not found', async () => {
    await expect(() =>
      useCase.execute({ id: 'invalid-id' }),
    ).rejects.toThrowError();
  });

  it('should throw an error if the appointment is already finished', async () => {
    appointment.finish();

    await expect(() =>
      useCase.execute({ id: appointment.id! }),
    ).rejects.toThrowError();
  });

  it('should throw an error if the appointment is already canceled', async () => {
    appointment.cancel();

    await expect(() =>
      useCase.execute({ id: appointment.id! }),
    ).rejects.toThrowError();
  });

  it('should throw an error if the appointment is already expired', async () => {
    appointment.discard();

    await expect(() =>
      useCase.execute({ id: appointment.id! }),
    ).rejects.toThrowError();
  });

  it('should cancel the appointment and update the repository if valid', async () => {
    await dependecies.appointmentRepo.create(appointment);

    await expect(
      useCase.execute({
        id: appointment.id!,
      }),
    ).resolves.toBe(appointment);
  });
});

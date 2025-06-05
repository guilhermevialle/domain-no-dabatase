import { Appointment } from '@/domain/entities/appointment';
import {
  buildDependencies,
  IBuildDependencies,
} from '@/test/builders/build-dependencies';
import { buildAppointment } from '@/test/builders/build-entities';
import { beforeEach, describe, expect, it } from 'vitest';
import { CancelAppointment } from './cancel-appointment';

describe('CancelAppointment Use Case', () => {
  let useCase: CancelAppointment;
  let dependencies: IBuildDependencies;
  let appointment: Appointment;

  beforeEach(() => {
    dependencies = buildDependencies();
    appointment = buildAppointment({
      barberId: 'barber-1',
      customerId: 'customer-1',
    });
    useCase = new CancelAppointment(dependencies.appointmentRepo);
  });

  it('should throw an error if the appointment is not found', async () => {
    await expect(() =>
      useCase.execute({ id: 'invalid-id' }),
    ).rejects.toThrowError();
  });

  it('should throw an error if the appointment is already finished', async () => {
    appointment.schedule();
    appointment.finish();

    await expect(() =>
      useCase.execute({ id: appointment.id }),
    ).rejects.toThrowError();
  });

  it('should throw an error if the appointment is already canceled', async () => {
    appointment.schedule();
    appointment.cancel();

    await expect(() =>
      useCase.execute({ id: appointment.id }),
    ).rejects.toThrowError();
  });

  it('should throw an error if the appointment is already expired', async () => {
    appointment.schedule();
    appointment.expire();

    await expect(() =>
      useCase.execute({ id: appointment.id }),
    ).rejects.toThrowError();
  });

  it('should cancel the appointment and update the repository if valid', async () => {
    appointment.schedule();
    await dependencies.appointmentRepo.create(appointment);

    await expect(
      useCase.execute({
        id: appointment.id,
      }),
    ).resolves.toBe(appointment);
  });
});

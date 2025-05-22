import { addMinutes, addYears } from 'date-fns';
import { beforeEach, describe, expect, it } from 'vitest';
import { Appointment } from '../../../domain/entities/appointment';
import { IAppointmentRepository } from '../../../interfaces/repositories/appointment-repository';
import { buildAppointment } from '../../../test/builders/build-entities';
import { InMemoryAppointmentRepository } from './in-memory-appointment-repository';

describe('InMemoryAppointmentRepository', () => {
  let appointmentRepo: IAppointmentRepository;
  let appointment: Appointment;
  let now: Date;

  beforeEach(() => {
    now = new Date();

    appointmentRepo = new InMemoryAppointmentRepository();
    appointment = new Appointment({
      barberId: 'barber-1',
      customerId: 'customer-1',
      service: 'Kids Haircut',
      startAt: addMinutes(now, 11),
      priceInCents: 3000,
    });
  });

  it('should create a single appointment', async () => {
    await expect(appointmentRepo.create(appointment)).resolves.toBeUndefined();
    await expect(appointmentRepo.findById(appointment.id!)).resolves.toBe(
      appointment,
    );
  });

  it('should create multiple appointments', async () => {
    const appointments = [
      buildAppointment({ barberId: 'barber-1', customerId: 'customer-1' }),
      buildAppointment({ barberId: 'barber-1', customerId: 'customer-2' }),
    ];

    await appointmentRepo.createMany(appointments);
    await expect(appointmentRepo.findById(appointments[0].id!)).resolves.toBe(
      appointments[0],
    );
    await expect(appointmentRepo.findById(appointments[1].id!)).resolves.toBe(
      appointments[1],
    );
  });

  it('should update an existing appointment', async () => {
    await appointmentRepo.create(appointment);
    appointment.cancel();

    await expect(appointmentRepo.update(appointment)).resolves.toBeUndefined();
    const updatedAppointment = await appointmentRepo.findById(appointment.id!);

    expect(updatedAppointment!.status).toBe('CANCELED');
  });

  it('should find an appointment by id', async () => {
    await appointmentRepo.create(appointment);

    await expect(appointmentRepo.findById(appointment.id!)).resolves.toBe(
      appointment,
    );
  });

  it('should return null if appointment is not found by id', async () => {
    await expect(appointmentRepo.findById('invalid-id')).resolves.toBe(null);
  });

  it('should find all appointments by barber id', async () => {
    const appointments = [
      buildAppointment({ barberId: 'barber-1', customerId: 'customer-1' }),
      buildAppointment({ barberId: 'barber-1', customerId: 'customer-2' }),
    ];

    await appointmentRepo.createMany(appointments);

    await expect(
      appointmentRepo.findManyByBarberId('barber-1'),
    ).resolves.toEqual(appointments);
  });

  it('should find all appointments by customer id', async () => {
    const appointments = [
      buildAppointment({ barberId: 'barber-1', customerId: 'customer-1' }),
      buildAppointment({ barberId: 'barber-2', customerId: 'customer-1' }),
    ];

    await appointmentRepo.createMany(appointments);

    await expect(
      appointmentRepo.findManyByCustomerId('customer-1'),
    ).resolves.toEqual(appointments);
  });

  it('should find all expired appointments', async () => {
    const appointments = [
      buildAppointment({
        barberId: 'barber-1',
        customerId: 'customer-1',
      }),
      buildAppointment({
        barberId: 'barber-1',
        customerId: 'customer-2',
      }),
    ];

    appointments[0].discard();
    appointments[1].discard();

    await appointmentRepo.createMany(appointments);
    await expect(
      appointmentRepo.findManyByBarberId('barber-1'),
    ).resolves.toEqual(appointments);
  });

  it('should find all appointments for a barber in a date range', async () => {
    const appointments = [
      buildAppointment({
        barberId: 'barber-1',
        customerId: 'customer-1',
      }),
      buildAppointment({
        barberId: 'barber-1',
        customerId: 'customer-2',
      }),
    ];

    await appointmentRepo.createMany(appointments);
    await expect(
      appointmentRepo.findManyByBarberIdInRange(
        'barber-1',
        now,
        addYears(now, 1),
      ),
    ).resolves.toEqual(appointments);
  });

  it('should detect overlapping appointment for barber', async () => {
    const appointments = [
      buildAppointment({
        barberId: 'barber-1',
        customerId: 'customer-1',
      }),
      buildAppointment({
        barberId: 'barber-1',
        customerId: 'customer-2',
      }),
    ];

    await appointmentRepo.createMany(appointments);
    await expect(
      appointmentRepo.isOverlappingByDateAndBarberId(
        'barber-1',
        addMinutes(now, 10),
        addMinutes(now, 20),
      ),
    ).resolves.toBe(true);
  });

  it('should return false if no overlap is found', async () => {
    await expect(
      appointmentRepo.isOverlappingByDateAndBarberId(
        'barber-1',
        addMinutes(now, 10),
        addMinutes(now, 20),
      ),
    ).resolves.toBe(false);
  });
});

import { beforeEach, describe, expect, it } from 'vitest';
import { Appointment } from '../../../domain/entities/appointment';
import { Barber } from '../../../domain/entities/barber';
import { Customer } from '../../../domain/entities/customer';
import { Rating } from '../../../domain/entities/rating';
import {
  buildAppointment,
  buildBarber,
  buildCustomer,
} from '../../../test/builders/build-entities';
import {
  buildRepositories,
  IBuildRepositories,
} from '../../../test/builders/build-repositories';
import { RateAppointment } from './rate-appointment';

describe('RateAppointment Use Case', () => {
  let rating: Rating;
  let barber: Barber;
  let customer: Customer;
  let appointment: Appointment;
  let repos: IBuildRepositories;
  let useCase: RateAppointment;

  beforeEach(() => {
    rating = new Rating({
      appointmentId: 'appointment-1',
      barberId: 'barber-1',
      customerId: 'customer-1',
      comment: 'Great service!',
      rating: 5,
    });
    barber = buildBarber('barber-1');
    customer = buildCustomer('customer-1');
    appointment = buildAppointment({
      id: 'appointment-1',
      barberId: 'barber-1',
      customerId: 'customer-1',
    });
    repos = buildRepositories();
    useCase = new RateAppointment(repos.ratingRepo, repos.appointmentRepo);
  });

  it('should throw an error if the appointment is not found', async () => {
    await expect(() => useCase.execute(rating.toJSON())).rejects.toThrowError();
  });

  it('should throw an error if the appointment barberId does not match the provided barberId', async () => {
    await expect(() =>
      useCase.execute({ ...rating.toJSON(), barberId: 'invalid-barber-id' }),
    ).rejects.toThrowError();
  });

  it('should throw an error if the appointment customerId does not match the provided customerId', async () => {
    await expect(() =>
      useCase.execute({
        ...rating.toJSON(),
        customerId: 'invalid-customer-id',
      }),
    ).rejects.toThrowError();
  });

  it('should throw an error if the appointment is already rated', async () => {
    await repos.ratingRepo.create(rating);

    await expect(() =>
      useCase.execute({
        ...rating.toJSON(),
      }),
    ).rejects.toThrowError();
  });

  it('should create and return a new rating if all validations pass', async () => {
    await repos.barberRepo.create(barber);
    await repos.customerRepo.create(customer);
    await repos.appointmentRepo.create(appointment);

    const result = await useCase.execute({
      ...rating.toJSON(),
    });

    expect(result.rating).toBe(rating.rating);
    expect(result.appointmentId).toBe(rating.appointmentId);
    expect(result.customerId).toBe(rating.customerId);
    expect(result.barberId).toBe(rating.barberId);
    expect(result.comment).toBe(rating.comment);
  });
});

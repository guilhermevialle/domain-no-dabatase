import { addMinutes } from 'date-fns';
import { beforeEach, describe, expect, it } from 'vitest';
import { buildAvailability } from '../../../test/builders/build-availability';
import {
  buildBarber,
  buildCustomer,
} from '../../../test/builders/build-entities';
import {
  buildRepositories,
  IBuildRepositories,
} from '../../../test/builders/build-repositories';
import {
  buildServices,
  IBuildServices,
} from '../../../test/builders/build-services';
import { CreateAppointment } from './create-appointment';

describe('CreateAppointment Use Case', () => {
  let now: Date;
  let repos: IBuildRepositories;
  let useCase: CreateAppointment;
  let services: IBuildServices;

  beforeEach(() => {
    now = new Date();
    repos = buildRepositories();
    services = buildServices();
    useCase = new CreateAppointment(
      repos.appointmentRepo,
      repos.customerRepo,
      repos.barberRepo,
      services.barberAvailability,
    );
  });

  it('should create an appointment if barber and customer exist and barber is available', async () => {
    await repos.barberRepo.create(buildBarber('barber-1'));
    await repos.customerRepo.create(buildCustomer('customer-1'));
    buildAvailability('barber-1', repos.availableDayRepo, repos.timeSlotRepo);

    const availableDays =
      await repos.availableDayRepo.findManyByBarberId('barber-1');

    console.log(availableDays);
    availableDays.forEach(async (availableDay, index) =>
      console.log(
        await repos.timeSlotRepo.findManyByAvailableDayId(
          availableDays[index].id!,
        ),
      ),
    );

    expect(
      useCase.execute({
        barberId: 'barber-1',
        customerId: 'customer-1',
        service: 'Clean Shave',
        startAt: addMinutes(now, 10),
      }),
    ).resolves.not.toThrow();
  });
});

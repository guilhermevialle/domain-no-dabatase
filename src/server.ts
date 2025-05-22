import { addMinutes } from 'date-fns';
import { buildAvailability } from './test/builders/build-availability';
import { buildBarber } from './test/builders/build-entities';
import { buildRepositories } from './test/builders/build-repositories';
import { buildServices } from './test/builders/build-services';

async function run() {
  try {
    const repos = buildRepositories();
    const services = buildServices();

    await repos.barberRepo.create(buildBarber('barber-1'));

    await buildAvailability(
      'barber-1',
      repos.availableDayRepo,
      repos.timeSlotRepo,
    );

    console.log(
      JSON.stringify(await repos.barberRepo.findById('barber-1'), null, 2),
    );

    const availableDays =
      await repos.availableDayRepo.findManyByBarberId('barber-1');

    console.log(JSON.stringify(availableDays, null, 2));

    availableDays.forEach(async (day) =>
      console.log(
        JSON.stringify(
          await repos.timeSlotRepo.findManyByAvailableDayId(day.id!),
          null,
          2,
        ),
      ),
    );

    const isAvailable = await services.barberAvailability.isAvailable(
      'barber-1',
      new Date(),
      addMinutes(new Date(), 10),
    );

    console.log({ isAvailable });
  } catch (err: any) {
    console.error(err.message);
  }
}

run();

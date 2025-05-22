import { AvailableDay } from '../../domain/entities/available-day';
import { TimeSlot } from '../../domain/entities/time-slot';
import { Time } from '../../domain/value-objects/time';
import { IAvailableDayRepository } from '../../interfaces/repositories/available-day-repository';
import { ITimeSlotRepository } from '../../interfaces/repositories/time-slot-repository';

export async function buildAvailability(
  barberId: string,
  availableDayRepo: IAvailableDayRepository,
  timeSlotRepo: ITimeSlotRepository,
): Promise<void> {
  const promises = Array.from({ length: 7 }, (_, weekday) =>
    (async () => {
      const availableDay = new AvailableDay({
        barberId,
        weekday,
      });

      await availableDayRepo.create(availableDay);

      await timeSlotRepo.create(
        new TimeSlot({
          availableDayId: availableDay.id!,
          start: new Time('00:00'),
          end: new Time('23:59'),
        }),
      );
    })(),
  );

  await Promise.all(promises);
}

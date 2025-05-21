import { AvailableDay } from '../../domain/entities/available-day';
import { TimeSlot } from '../../domain/entities/time-slot';
import { Time } from '../../domain/value-objects/time';
import { IAvailableDayRepository } from '../../interfaces/repositories/available-day-repository';
import { ITimeSlotRepository } from '../../interfaces/repositories/time-slot-repository';

export async function buildAvailability(
  barberId: string,
  availableDayRepo: IAvailableDayRepository,
  timeSlotRepo: ITimeSlotRepository,
) {
  for (let weekday = 0; weekday <= 4; weekday++) {
    const availableDay = new AvailableDay({
      id: `available-day-${weekday}`,
      barberId,
      weekday,
    });
    await availableDayRepo.create(availableDay);

    await timeSlotRepo.create(
      new TimeSlot({
        id: `slot-${weekday}`,
        availableDayId: availableDay.id!,
        start: new Time('00:00'),
        end: new Time('23:59'),
      }),
    );
  }
}

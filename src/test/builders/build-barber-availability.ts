import { AvailableDay } from '../../domain/entities/available-day';
import { TimeSlot } from '../../domain/entities/time-slot';
import { Time } from '../../domain/value-objects/time';

type BuildAvailabilityOptions = Partial<{
  startDay: number;
  endDay: number;
  startTime: string;
  endTime: string;
}>;

export function buildAvailability(
  barberId: string,
  {
    startDay = 0,
    endDay = 6,
    startTime = '00:00',
    endTime = '23:59',
  }: BuildAvailabilityOptions = {},
): {
  availableDays: AvailableDay[];
  timeSlots: TimeSlot[];
} {
  const availableDays: AvailableDay[] = [];
  const timeSlots: TimeSlot[] = [];

  const days = Array.from(
    { length: endDay - startDay + 1 },
    (_, i) => i + startDay,
  );

  days.forEach((weekday) => {
    const availableDay = new AvailableDay({
      id: `available-day-${barberId}-${weekday}`,
      barberId,
      weekday,
    });

    availableDays.push(availableDay);

    const timeSlot = new TimeSlot({
      id: `time-slot-${barberId}-${weekday}`,
      availableDayId: availableDay.id!,
      start: new Time(startTime),
      end: new Time(endTime),
    });

    timeSlots.push(timeSlot);
  });

  return { availableDays, timeSlots };
}

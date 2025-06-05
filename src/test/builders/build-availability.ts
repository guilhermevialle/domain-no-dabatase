import { Shift } from '@/domain/entities/shift';
import { WorkDay } from '@/domain/entities/work-day';
import { Time } from '@/domain/value-objects/time';

interface Interval {
  start: Time;
  end: Time;
}

type AvailabilityProps = Partial<{
  startDay: number;
  endDay: number;
  intervals: Interval[];
}>;

export function buildAvailability(
  barberId: string,
  {
    startDay = 0,
    endDay = 6,
    intervals = [
      {
        start: Time.create('00:00'),
        end: Time.create('23:59'),
      },
    ],
  }: AvailabilityProps = {},
) {
  const workDays: WorkDay[] = [];

  const betweenDaysRange = Array.from(
    { length: endDay - startDay + 1 },
    (_, i) => i + startDay,
  );

  betweenDaysRange.forEach((weekday) => {
    const shifts = intervals.map((interval) =>
      Shift.create({
        workDayId: `available-day-${barberId}-${weekday}`,
        start: Time.create(interval.start.inMinutes),
        end: Time.create(interval.end.inMinutes),
      }),
    );

    const workDay = WorkDay.restore({
      id: `available-day-${barberId}-${weekday}`,
      barberId,
      weekday,
      shifts,
    });

    workDays.push(workDay);
  });

  return { workDays };
}

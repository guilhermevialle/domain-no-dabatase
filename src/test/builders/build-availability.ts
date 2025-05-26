import { Shift } from '../../domain/entities/shift';
import { WorkDay } from '../../domain/entities/work-day';
import { Time } from '../../domain/value-objects/time';

interface Interval {
  start: string;
  end: string;
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
    intervals = [{ start: '00:00', end: '23:59' }],
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
        start: Time.create(interval.start),
        end: Time.create(interval.end),
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

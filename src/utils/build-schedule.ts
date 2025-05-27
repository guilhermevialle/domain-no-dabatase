import { addDays, addMinutes, format, isBefore } from 'date-fns';
import { Barber } from '../domain/aggregates/barber';

interface Options {
  daysAhead: number;
  busy?: Record<string, string[]>;
}

export function buildSchedule(
  barber: Barber,
  { daysAhead, busy = {} }: Options,
): Record<string, string[]> {
  const schedule: Record<string, string[]> = {};
  const now = new Date();

  for (let i = 0; i < daysAhead; i++) {
    const currentDate = addDays(now, i);
    const weekday = currentDate.getDay();

    const workDay = barber.workDays.find((wd) => wd.weekday === weekday);
    if (!workDay) continue;

    const dateKey = format(currentDate, 'yyyy-MM-dd');
    const busyTimes = new Set(busy[dateKey] ?? []);
    const slots: string[] = [];

    for (const shift of workDay.shifts) {
      let current = shift.start.toDate(currentDate);
      const end = shift.end.toDate(currentDate);

      while (isBefore(current, end)) {
        const timeString = format(current, 'HH:mm');
        if (!busyTimes.has(timeString)) {
          slots.push(timeString);
        }
        current = addMinutes(current, 30);
      }
    }

    schedule[dateKey] = slots;
  }

  return schedule;
}

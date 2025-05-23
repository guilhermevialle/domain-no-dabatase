import { addMinutes, format } from 'date-fns';
import { TimeSlot } from '../../domain/entities/time-slot';

export const buildBarberWorkTimes = (
  slots: TimeSlot[],
  interval: number = 30,
): string[] => {
  const workTimes: string[] = [];

  for (const slot of slots) {
    const baseDate = new Date();
    let current = slot.start.toDate(baseDate);
    const end = slot.end.toDate(baseDate);

    while (current < end) {
      workTimes.push(format(current, 'HH:mm'));
      current = addMinutes(current, interval);
    }
  }

  return workTimes;
};

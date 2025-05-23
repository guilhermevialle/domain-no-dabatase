import { AvailableDay } from '../../domain/entities/available-day';
import { TimeSlot } from '../../domain/entities/time-slot';
import { Time } from '../../domain/value-objects/time';

interface Slot {
  startTime: string;
  endTime: string;
}

type AvailabilityProps = Partial<{
  startDay: number;
  endDay: number;
  slots: Slot[];
}>;

export function buildAvailability(
  barberId: string,
  {
    startDay = 0,
    endDay = 6,
    slots = [{ startTime: '00:00', endTime: '23:59' }],
  }: AvailabilityProps = {},
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
    const availableDay = AvailableDay.restore({
      id: `available-day-${barberId}-${weekday}`,
      barberId,
      weekday,
    });

    availableDays.push(availableDay);

    slots.forEach((slot, index) => {
      const timeSlot = TimeSlot.restore({
        id: `time-slot-${barberId}-${weekday}-${index}`,
        availableDayId: availableDay.id!,
        start: new Time(slot.startTime),
        end: new Time(slot.endTime),
      });

      timeSlots.push(timeSlot);
    });
  });

  return { availableDays, timeSlots };
}

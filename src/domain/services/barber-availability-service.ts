import { getDay } from 'date-fns'
import { IAppointmentRepository } from '../../interfaces/repositories/appointment-repository'
import { IAvailableDayRepository } from '../../interfaces/repositories/available-day-repository'
import { ITimeSlotRepository } from '../../interfaces/repositories/time-slot-repository'
import { Barber } from '../entities/barber'
import { Time } from '../value-objects/time'
import { IBarberAvailabilityService } from './../../interfaces/services/barber-availability-service'

export class BarberAvailabilityService implements IBarberAvailabilityService {
  constructor(
    private appointmentRepo: IAppointmentRepository,
    private availableDayRepo: IAvailableDayRepository,
    private timeSlotRepo: ITimeSlotRepository
  ) {}

  async isBarberAvailable(
    barber: Barber,
    startAt: Date,
    endAt: Date
  ): Promise<boolean> {
    const weekday = getDay(startAt)

    if (weekday < 0 || weekday > 6)
      throw new Error(
        'Invalid weekday. Must be between 0 (Sunday) and 6 (Saturday).'
      )

    const isSomeOverlapping =
      await this.appointmentRepo.isOverlappingByDateAndBarberId(
        barber.id!,
        startAt,
        endAt
      )

    if (isSomeOverlapping) return false

    const availableDay = await this.availableDayRepo.findByWeekdayAndBarberId(
      barber.id!,
      weekday
    )

    if (!availableDay) return false

    const timeSlots = await this.timeSlotRepo.findManyByAvailableDayId(
      availableDay.id!
    )

    if (timeSlots.length === 0) return false

    const startTime = new Time(startAt)

    return timeSlots.some(
      (slot) =>
        !startTime.isUnderThan(slot.start) && !startTime.isOverThan(slot.end)
    )
  }
}

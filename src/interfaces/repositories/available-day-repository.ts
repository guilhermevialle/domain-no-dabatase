import { AvailableDay } from '../../domain/entities/available-day';

export interface IAvailableDayRepository {
  create(day: AvailableDay): Promise<void>;
  createMany(days: AvailableDay[]): Promise<void>;
  findManyByBarberId(barberId: string): Promise<AvailableDay[]>;
  findByWeekdayAndBarberId(
    barberId: string,
    weekday: number,
  ): Promise<AvailableDay | null>;
  listAll(): Promise<AvailableDay[]>;
}

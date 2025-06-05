import { Barber } from '../../domain/aggregates/barber';

export interface IBarberRepository {
  create: (barber: Barber) => Promise<void>;
  update: (barber: Barber) => Promise<void>;
  findById: (id: string) => Promise<Barber | null>;
  clear: () => Promise<void>;
}

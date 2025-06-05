import { Customer } from '@/domain/entities/customer';

export interface ICustomerRepository {
  create: (customer: Customer) => Promise<void>;
  update: (customer: Customer) => Promise<void>;
  findById: (id: string) => Promise<Customer | null>;
}

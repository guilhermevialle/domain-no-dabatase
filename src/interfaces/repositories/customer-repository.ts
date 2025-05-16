import { Customer } from '../../domain/entities/customer'

export interface ICustomerRepository {
  findByid: (id: string) => Promise<Customer | null>
  create: (customer: Customer) => Promise<void>
}

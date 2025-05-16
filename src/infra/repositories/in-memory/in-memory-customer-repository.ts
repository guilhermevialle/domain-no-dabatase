import { Customer } from '../../../domain/entities/customer'
import { ICustomerRepository } from '../../../interfaces/repositories/customer-repository'

export class InMemoryCustomerRepository implements ICustomerRepository {
  private items: Customer[] = []

  async create(customer: Customer): Promise<void> {
    this.items.push(customer)
  }

  async findByid(id: string): Promise<Customer | null> {
    const customer = this.items.find((customer) => customer.id === id)
    return customer ?? null
  }
}

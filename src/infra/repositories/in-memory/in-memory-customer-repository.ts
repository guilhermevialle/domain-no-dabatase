import { Customer } from '../../../domain/entities/customer'
import { ICustomerRepository } from '../../../interfaces/repositories/customer-repository'

export class InMemoryCustomerRepository implements ICustomerRepository {
  private storage: Customer[] = []

  async create(customer: Customer): Promise<void> {
    this.storage.push(customer)
  }

  async update(customer: Customer): Promise<void> {
    const index = this.storage.findIndex(
      (customer) => customer.id === customer.id
    )

    if (index === -1) throw new Error('Customer not found')

    this.storage[index] = customer
  }

  async findById(id: string): Promise<Customer | null> {
    const result = this.storage.find((customer) => customer.id === id)
    return result ?? null
  }
}

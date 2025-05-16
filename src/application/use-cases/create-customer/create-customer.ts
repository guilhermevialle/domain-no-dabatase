import { Customer } from '../../../domain/entities/customer'
import { Email } from '../../../domain/value-objects/email'
import { BrazilPhone } from '../../../domain/value-objects/phone'
import { ICustomerRepository } from '../../../interfaces/repositories/customer-repository'

interface CreateCustomerRequest {
  id: string
  fullName: string
  email: string
  phone: string
}

type CreateCustomerResponse = Customer

export class CreateCustomer {
  constructor(private customerRepo: ICustomerRepository) {}

  async execute({
    email,
    fullName,
    id,
    phone,
  }: CreateCustomerRequest): Promise<CreateCustomerResponse> {
    const customer = new Customer({
      id,
      fullName,
      email: new Email(email),
      phone: new BrazilPhone(phone),
    })

    const customerExists = await this.customerRepo.findByid(customer.id)

    if (customerExists) throw new Error('Email already registered.')

    this.customerRepo.create(customer)

    return customer
  }
}

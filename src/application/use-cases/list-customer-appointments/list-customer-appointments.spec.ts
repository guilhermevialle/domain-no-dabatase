import { addMinutes } from 'date-fns'
import { beforeEach, describe, expect, it } from 'vitest'
import { Appointment } from '../../../domain/entities/appointment'
import { Customer } from '../../../domain/entities/customer'
import { Email } from '../../../domain/value-objects/email'
import { BrazilPhone } from '../../../domain/value-objects/phone'
import { InMemoryAppointmentRepository } from '../../../infra/repositories/in-memory/in-memory-appointment-repository'
import { InMemoryCustomerRepository } from '../../../infra/repositories/in-memory/in-memory-customer-repository'
import { IAppointmentRepository } from '../../../interfaces/repositories/appointment-repository'
import { ICustomerRepository } from '../../../interfaces/repositories/customer-repository'
import { ListCustomerAppointments } from './list-customer-appointments'

describe('ListCustomerAppointmentsUseCase', () => {
  let appointmentRepo: IAppointmentRepository
  let customerRepo: ICustomerRepository
  let useCase: ListCustomerAppointments

  beforeEach(() => {
    appointmentRepo = new InMemoryAppointmentRepository()
    customerRepo = new InMemoryCustomerRepository()
    useCase = new ListCustomerAppointments(appointmentRepo, customerRepo)
  })

  it('should list customer appointments successfully', async () => {
    await customerRepo.create(
      new Customer({
        id: 'customer-1',
        email: new Email('guivialle@gmail.com'),
        phone: new BrazilPhone('27999999999'),
        fullName: 'gui vialle',
      })
    )

    await appointmentRepo.create(
      new Appointment({
        barberId: 'barber-1',
        customerId: 'customer-1',
        service: 'Clean Shave',
        startAt: addMinutes(new Date(), 10),
      })
    )

    await appointmentRepo.create(
      new Appointment({
        barberId: 'barber-2',
        customerId: 'customer-1',
        service: 'Clean Shave',
        startAt: addMinutes(new Date(), 10),
      })
    )

    await appointmentRepo.create(
      new Appointment({
        barberId: 'barber-3',
        customerId: 'customer-1',
        service: 'Clean Shave',
        startAt: addMinutes(new Date(), 10),
      })
    )

    const appointments = await useCase.execute({ id: 'customer-1' })

    expect(Array.isArray(appointments)).toBe(true)
    expect(appointments).toHaveLength(3)
    appointments.forEach((appointment) => {
      expect(appointment).toBeInstanceOf(Appointment)
      expect(appointment.customerId).toBe('customer-1')
    })
  })

  it('should throw if customer does not exist', async () => {
    await expect(useCase.execute({ id: 'customer-1' })).rejects.toThrow(
      'Customer not found.'
    )
  })
})

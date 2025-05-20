import { addMinutes } from 'date-fns'
import { Appointment } from './domain/entities/appointment'
import { Barber } from './domain/entities/barber'
import { Customer } from './domain/entities/customer'
import { Email } from './domain/value-objects/email'
import { BrazilPhone } from './domain/value-objects/phone'

const barber = new Barber({
  id: 'barber-1',
  fullName: 'John Doe',
  services: ['Beard Trim'],
  since: new Date(),
})

const customer = new Customer({
  id: 'customer-1',
  fullName: 'Guilherme Viale',
  phone: new BrazilPhone('11999999999'),
  email: new Email('vialelguilherme@gmail.com'),
})

const appointment = new Appointment({
  id: 'appointment-1',
  barberId: barber.id!,
  customerId: customer.id!,
  startAt: addMinutes(new Date(), 30),
  service: 'Beard Trim',
  duration: 30 + barber.bufferTimeMinutes!,
})

console.log('Appointment:', appointment)

import { nanoid } from 'nanoid'
import { Appointment } from './domain/entities/appointment'
import { Barber } from './domain/entities/barber'

const barber = new Barber({
  id: nanoid(21),
  bufferTimeMinutes: 10,
  fullName: 'John Doe',
  services: ['Beard Trim', 'Kids Haircut'],
  since: new Date(2015, 1, 1),
})

const appointment = new Appointment({
  barberId: barber.id,
  customerId: nanoid(21),
  service: 'Beard Trim',
  startAt: new Date(),
  status: 'PENDING',
})

console.log(appointment)

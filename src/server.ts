import { Appointment } from './domain/entities/appointment';

const now = new Date();

const appointment = Appointment.create({
  barberId: 'barber-id',
  customerId: 'customer-id',
  service: 'Modern Haircut',
  startAt: now,
  priceInCents: 3000,
  duration: 30,
});

const restored = Appointment.restore(appointment.toJSON());

function getId(id: string) {
  console.log(id);
}

getId(appointment.id);

import { addMinutes } from 'date-fns';
import {
  Appointment,
  AppointmentProps,
} from '../../domain/entities/appointment';
import { Barber } from '../../domain/entities/barber';
import { Customer } from '../../domain/entities/customer';
import { Email } from '../../domain/value-objects/email';
import { BrazilPhone } from '../../domain/value-objects/phone';

type IBuildAppointment = Partial<AppointmentProps> & {
  barberId: string;
  customerId: string;
};

export const buildAppointment = ({ ...rest }: IBuildAppointment): Appointment =>
  new Appointment({
    service: 'Beard Trim',
    priceInCents: 35000,
    startAt: addMinutes(new Date(), 10),
    ...rest,
  });

export const buildBarber = (id: string): Barber =>
  new Barber({
    id,
    fullName: 'John doe',
    services: ['Beard Trim', 'Clean Shave'],
    since: new Date('2011-01-01'),
  });

export const buildCustomer = (id: string): Customer =>
  new Customer({
    id,
    fullName: 'Guilherme Vialle',
    email: new Email('guivialle@gmail.com'),
    phone: new BrazilPhone('27999999999'),
  });

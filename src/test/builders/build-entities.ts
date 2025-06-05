import { Barber } from '@/domain/aggregates/barber';
import { Appointment, AppointmentProps } from '@/domain/entities/appointment';
import { Customer } from '@/domain/entities/customer';
import { BrazilPhone } from '@/domain/value-objects/brazil-phone';
import { Email } from '@/domain/value-objects/email';
import { addDays } from 'date-fns';
import { buildAvailability } from './build-availability';

type IBuildAppointment = Partial<AppointmentProps> & {
  barberId: string;
  customerId: string;
};

export const buildAppointment = ({ ...rest }: IBuildAppointment): Appointment =>
  Appointment.create({
    service: 'Beard Trim',
    priceInCents: 35000,
    startAt: addDays(new Date(), 10),
    duration: 30,
    ...rest,
  });

export const buildBarber = (id: string): Barber => {
  const { workDays } = buildAvailability(id);

  return Barber.restore({
    id,
    fullName: 'John Doe',
    services: ['Beard Trim', 'Clean Shave'],
    workDays,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const buildCustomer = (id: string): Customer =>
  Customer.restore({
    id,
    fullName: 'Guilherme Vialle',
    email: Email.create('guivialle@gmail.com'),
    phone: BrazilPhone.create('27999999999'),
  });

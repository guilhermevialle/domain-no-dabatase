import {
  AvailableService,
  BASE_DURATIONS_IN_MINUTES,
} from '../../../@types/service'
import { Appointment } from '../../../domain/entities/appointment'
import { IAppointmentRepository } from '../../../interfaces/repositories/appointment-repository'
import { IBarberRepository } from '../../../interfaces/repositories/barber-repository'
import { ICustomerRepository } from '../../../interfaces/repositories/customer-repository'
import { IBarberAvailabilityService } from '../../../interfaces/services/barber-availability-service'

interface CreateAppointmentRequest {
  customerId: string
  barberId: string
  service: AvailableService
  startAt: Date
}

type CreateAppointmentResponse = Appointment

export class CreateAppointment {
  constructor(
    private appointmentRepo: IAppointmentRepository,
    private customerRepo: ICustomerRepository,
    private barberRepo: IBarberRepository,
    private barberAvailability: IBarberAvailabilityService
  ) {}

  async execute({
    barberId,
    customerId,
    service,
    startAt,
  }: CreateAppointmentRequest): Promise<CreateAppointmentResponse> {
    const customer = await this.customerRepo.findById(customerId)
    const barber = await this.barberRepo.findById(barberId)

    if (!customer) throw new Error('Customer not found.')
    if (!barber) throw new Error('Barber not found.')

    const appointment = new Appointment({
      barberId,
      customerId,
      service,
      startAt,
      duration: BASE_DURATIONS_IN_MINUTES[service] + barber.bufferTimeMinutes!,
    })

    const isAvailable = await this.barberAvailability.isBarberAvailable(
      barber,
      startAt,
      appointment.endAt
    )

    if (!isAvailable) throw new Error('Barber is not available at this time.')

    await this.appointmentRepo.create(appointment)
    return appointment
  }
}

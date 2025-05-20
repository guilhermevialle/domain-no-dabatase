import { Service } from '../../domain/entities/service'

export interface IAvailableServiceRepository {
  create(service: Service): Promise<void>
  findById(id: string): Promise<Service | null>
  findMany(): Promise<Service[]>
}

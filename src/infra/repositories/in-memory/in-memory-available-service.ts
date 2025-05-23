import { Service } from '../../../domain/entities/service';

export class InMemoryAvailableServiceRepository {
  private storage: Service[] = [];

  async create(service: Service): Promise<void> {
    this.storage.push(service);
  }

  async findById(id: string): Promise<Service | null> {
    const service = this.storage.find((service) => service.id === id);
    return service ?? null;
  }

  async findMany(): Promise<Service[]> {
    const results = this.storage;
    return results;
  }
}

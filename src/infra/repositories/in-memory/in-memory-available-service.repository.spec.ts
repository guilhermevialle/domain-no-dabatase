import { beforeEach, describe, expect, it } from 'vitest';
import { Service } from '../../../domain/entities/service';
import { IAvailableServiceRepository } from '../../../interfaces/repositories/service-repository';
import { InMemoryAvailableServiceRepository } from './in-memory-available-service.repository';

describe('InMemory AvailableService Repository', () => {
  let availableServiceRepo: IAvailableServiceRepository;
  let service: Service;

  beforeEach(() => {
    service = Service.create({
      name: 'Beard Trim',
      duration: 30,
      priceInCents: 3000,
    });
    availableServiceRepo = new InMemoryAvailableServiceRepository();
  });

  it('should store a new service', async () => {
    await availableServiceRepo.create(service);

    const services = await availableServiceRepo.findById(service.id!);

    expect(services).toEqual(service);
  });

  it('should return a service by id if it exists', async () => {
    await availableServiceRepo.create(service);

    const services = await availableServiceRepo.findById(service.id!);

    expect(services).toEqual(service);
  });

  it('should return null if no service is found with the given id', async () => {
    await expect(availableServiceRepo.findById('invalid-id')).resolves.toBe(
      null,
    );
  });

  it('should return all services in storage', async () => {
    await availableServiceRepo.create(service);

    const services = await availableServiceRepo.findMany();

    expect(services).toEqual([service]);
  });

  it('should return an empty array if no services are stored', async () => {
    const services = await availableServiceRepo.findMany();

    expect(services).toEqual([]);
  });
});

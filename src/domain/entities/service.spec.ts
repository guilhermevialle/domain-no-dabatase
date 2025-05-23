import { beforeEach, describe, expect, it } from 'vitest';
import { Service } from './service';

describe('Service Entity', () => {
  let service: Service;

  beforeEach(() => {
    service = Service.create({
      name: 'Beard Trim',
      duration: 30,
      priceInCents: 3000,
    });
  });

  it('should throw if price is less than 100', () => {
    expect(() => {
      Service.restore({
        ...service.toJSON(),
        priceInCents: 99,
      });
    }).toThrow();
  });

  it('should throw if duration is less than or equal to 0', () => {
    expect(() => {
      Service.restore({
        ...service.toJSON(),
        duration: 0,
      });
    }).toThrow();
  });

  it('should throw if duration is not a multiple of 30', () => {
    expect(() => {
      Service.restore({
        ...service.toJSON(),
        duration: 31,
      });
    }).toThrow();
  });
});

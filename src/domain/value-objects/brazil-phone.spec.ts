import { beforeEach, describe, expect, it } from 'vitest';
import { BrazilPhone } from './brazil-phone';

describe('Phone Value Object', () => {
  let phone: BrazilPhone;

  beforeEach(() => {
    phone = BrazilPhone.create('27999999999');
  });

  it('should create BrazilPhone with valid phone including country code', () => {
    expect(phone).toBeInstanceOf(BrazilPhone);
  });

  it('should throw if DDD is not valid', () => {
    expect(() => BrazilPhone.create('2999986558')).toThrow();
  });

  it("should create BrazilPhone with valid phone without country code and add '55'", () => {
    phone = BrazilPhone.create('27999999999');
    expect(phone.value).toBe('5527999999999');
  });

  it("should normalize phone to start with '55'", () => {
    phone = BrazilPhone.create('5527999999999');
    expect(phone.value).toBe('5527999999999');
  });

  it('should throw if phone number length is less than 10 digits', () => {
    expect(() => BrazilPhone.create('2799999')).toThrow();
  });

  it('should throw if phone number length is greater than 11 digits', () => {
    expect(() => BrazilPhone.create('2799999999999')).toThrow();
  });

  it('should throw if number part length is less than 8 digits', () => {
    expect(() => BrazilPhone.create('279999999')).toThrow();
  });

  it('should throw if number part length is greater than 9 digits', () => {
    expect(() => BrazilPhone.create('279999999999')).toThrow();
  });

  it('should return formatted phone number', () => {
    phone = BrazilPhone.create('5527999999999');
    expect(phone.formatted).toBe('+55 (27) 99999-9999');
  });
});

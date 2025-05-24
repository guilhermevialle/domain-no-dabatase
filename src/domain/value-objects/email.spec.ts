import { beforeEach, describe, expect, it } from 'vitest';
import { Email } from './email';

describe('Email Value Object', () => {
  let email: Email;

  beforeEach(() => {
    email = Email.create('WQH3T@example.com');
  });

  it('should create an Email with valid input', () => {
    expect(email).toBeInstanceOf(Email);
  });

  it('should transform email to lowercase', () => {
    expect(email.value).toBe('wqh3t@example.com');
  });

  it('should throw if email is invalid', () => {
    expect(() => Email.create('invalid-email')).toThrow();
  });
});

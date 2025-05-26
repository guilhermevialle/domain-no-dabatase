import { nanoid } from 'nanoid';

export function randomId(length: number = 21) {
  return nanoid(length);
}

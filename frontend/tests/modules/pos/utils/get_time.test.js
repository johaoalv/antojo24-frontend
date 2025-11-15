import { vi } from 'vitest';
import {
  getPanamaTime,
  getPanamaTime12h,
} from '../../../../src/modules/pos/utils/get_time.js';

describe('get_time utils', () => {
  const fixedDate = new Date('2024-01-15T12:34:56Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('devuelve la hora de Panamá en formato ISO (24h)', () => {
    expect(getPanamaTime()).toBe('2024-01-15T07:34:56');
  });

  it('devuelve la hora de Panamá en formato de reloj 12h', () => {
    expect(getPanamaTime12h()).toBe('7:34 am');
  });
});

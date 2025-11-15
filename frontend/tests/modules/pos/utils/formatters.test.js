import { formatCurrency } from '../../../../src/modules/pos/utils/formatters.js';

describe('formatCurrency', () => {
  it('formatea un número a moneda de dos decimales', () => {
    expect(formatCurrency(12.5)).toBe('$12.50');
    expect(formatCurrency()).toBe('$0.00');
  });
});

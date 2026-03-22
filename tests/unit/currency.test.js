const {
  normalizeCurrencyInput,
  formatCurrency
} = require('../../src/utils/currency');

describe('Currency Utils', () => {
  it('normalizes brazilian currency strings', () => {
    expect(normalizeCurrencyInput('1.234,56')).toBe(1234.56);
    expect(normalizeCurrencyInput('R$ 89,90')).toBe(89.9);
  });

  it('keeps plain numeric values compatible', () => {
    expect(normalizeCurrencyInput('1200.5')).toBe(1200.5);
    expect(normalizeCurrencyInput(45)).toBe(45);
  });

  it('returns a fixed string when requested', () => {
    expect(normalizeCurrencyInput('10,5', { asString: true })).toBe('10.50');
  });

  it('formats values to pt-BR currency style', () => {
    expect(formatCurrency(1234.56)).toBe('1.234,56');
  });
});

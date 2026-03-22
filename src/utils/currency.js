const numeral = require('numeral');

numeral.register('locale', 'pt-br', {
  delimiters: {
    thousands: '.',
    decimal: ','
  },
  abbreviations: {
    thousand: 'mil',
    million: 'mi',
    billion: 'bi',
    trillion: 'tri'
  },
  ordinal: () => 'o',
  currency: {
    symbol: 'R$'
  }
});

numeral.locale('pt-br');

function normalizeCurrencyInput(value, options = {}) {
  const {
    emptyValue = null,
    asString = false
  } = options;

  if (value === undefined || value === null) {
    return emptyValue;
  }

  if (typeof value === 'number') {
    const normalizedNumber = Number(value.toFixed(2));
    return asString ? normalizedNumber.toFixed(2) : normalizedNumber;
  }

  const rawValue = String(value).trim();
  if (!rawValue) {
    return emptyValue;
  }

  let sanitized = rawValue
    .replace(/R\$\s?/gi, '')
    .replace(/\s+/g, '')
    .replace(/[^\d,.-]/g, '');

  const hasComma = sanitized.includes(',');
  const hasDot = sanitized.includes('.');

  if (hasComma) {
    sanitized = sanitized.replace(/\./g, '').replace(',', '.');
  } else if (hasDot && sanitized.split('.').length > 2) {
    const parts = sanitized.split('.');
    const decimalPart = parts.pop();
    sanitized = `${parts.join('')}.${decimalPart}`;
  }

  const parsedValue = Number(sanitized);
  if (Number.isNaN(parsedValue)) {
    return emptyValue;
  }

  const normalizedNumber = Number(parsedValue.toFixed(2));
  return asString ? normalizedNumber.toFixed(2) : normalizedNumber;
}

function formatCurrency(value) {
  const normalizedValue = normalizeCurrencyInput(value, { emptyValue: 0 });
  return numeral(normalizedValue).format('0,0.00');
}

module.exports = {
  normalizeCurrencyInput,
  formatCurrency
};

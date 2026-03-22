(function () {
  if (typeof window === 'undefined' || typeof window.numeral === 'undefined') {
    return;
  }

  window.numeral.register('locale', 'pt-br', {
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
    ordinal: function () {
      return 'o';
    },
    currency: {
      symbol: 'R$'
    }
  });

  window.numeral.locale('pt-br');

  function normalize(value) {
    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value === 'number') {
      return Number(value.toFixed(2));
    }

    var rawValue = String(value).trim();
    if (!rawValue) {
      return null;
    }

    var sanitized = rawValue
      .replace(/R\$\s?/gi, '')
      .replace(/\s+/g, '')
      .replace(/[^\d,.-]/g, '');

    if (sanitized.indexOf(',') >= 0) {
      sanitized = sanitized.replace(/\./g, '').replace(',', '.');
    } else if ((sanitized.match(/\./g) || []).length > 1) {
      var parts = sanitized.split('.');
      var decimalPart = parts.pop();
      sanitized = parts.join('') + '.' + decimalPart;
    }

    var parsed = Number(sanitized);
    return Number.isNaN(parsed) ? null : Number(parsed.toFixed(2));
  }

  function format(value) {
    var normalizedValue = normalize(value);
    if (normalizedValue === null) {
      return '';
    }

    return window.numeral(normalizedValue).format('0,0.00');
  }

  function handleCurrencyInput(event) {
    var input = event.target;
    var digitsOnly = input.value.replace(/\D/g, '');

    if (!digitsOnly) {
      input.value = '';
      return;
    }

    var centsValue = Number(digitsOnly) / 100;
    input.value = format(centsValue);
  }

  function bindInputs(selector) {
    var resolvedSelector = selector || '.js-currency-input, .input-price';

    document.querySelectorAll(resolvedSelector).forEach(function (input) {
      if (input.dataset.currencyBound === 'true') {
        return;
      }

      input.setAttribute('inputmode', 'numeric');
      input.addEventListener('input', handleCurrencyInput);
      input.addEventListener('blur', function () {
        if (input.value) {
          input.value = format(input.value);
        }
      });

      if (input.value) {
        input.value = format(input.value);
      }

      input.dataset.currencyBound = 'true';
    });
  }

  window.VendaMaisCurrency = {
    normalize: normalize,
    format: format,
    bindInputs: bindInputs
  };

  document.addEventListener('DOMContentLoaded', function () {
    bindInputs();
  });
})();

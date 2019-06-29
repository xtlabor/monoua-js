function Currency(code) {
    this.code = +code || 0;
    this.name = Currency.currencies[this.code].name || '';
    this.symbol = Currency.currencies[this.code].symbol || '';
    this.startPosition = Currency.currencies[this.code].startPosition || false;
}

Currency.currencies = {
    124: {code: 124, name: 'CAD', symbol: 'cad', startPosition: false},
    203: {code: 203, name: 'CZK', symbol: 'czk', startPosition: false},
    208: {code: 208, name: 'DKK', symbol: 'dkk', startPosition: false},
    348: {code: 348, name: 'HUF', symbol: 'huf', startPosition: false},
    643: {code: 643, name: 'RUB', symbol: '₽', startPosition: true},
    756: {code: 756, name: 'CHF', symbol: 'chf', startPosition: false},
    826: {code: 826, name: 'GBP', symbol: '£', startPosition: true},
    933: {code: 933, name: 'BYN', symbol: 'byn', startPosition: false},
    949: {code: 949, name: 'TRY', symbol: '₺', startPosition: true},
    985: {code: 985, name: 'PLN', symbol: 'pln', startPosition: false},
    978: {code: 978, name: 'EUR', symbol: '€', startPosition: true},
    840: {code: 840, name: 'USD', symbol: '$', startPosition: true},
    980: {code: 980, name: 'UAH', symbol: '₴', startPosition: true},
};

Currency.defaultCurrencyCode = 980;

Currency.prototype.getValueDisplay = function(value = 0, inCoins = true) {
    value = inCoins === true ? this.getMoneyFormat(+value / 100) : +value;

    return this.startPosition ? `${this.symbol} ${value}` : `${value} ${this.symbol}`;
};

Currency.prototype.getMoneyFormat = function(value) {
    const pieces = parseFloat(value).toFixed(2).split('');
    let ii = pieces.length - 3;
    while ((ii -= 3) > 0) {
        pieces.splice(ii, 0, ' ');
    }
    return pieces.join('');
};

module.exports = Currency;

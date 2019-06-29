const moment = require('moment');
const _ = require('lodash');

const Currency = require('./currency');

function CurrencyInfo(obj) {
    obj = obj || {};

    this.currencyA = new Currency(obj.currencyCodeA) || null;
    this.currencyB = new Currency(obj.currencyCodeB) || null;
    this.date = moment.unix(obj.date) || null;
    this.rateSell = obj.rateSell || null;
    this.rateBuy = obj.rateBuy || null;
    this.rateCross = obj.rateCross || null;
}

CurrencyInfo.prototype.getRate = function(rate) {
    return this.currencyB.getValueDisplay(rate, false);
};

CurrencyInfo.prototype.getDate = function(format = 'DD-MM-YYYY HH:mm') {
    if (!_.isEmpty(this.date)) {
        return this.date.format(format);
    }

    return null;
};

module.exports = CurrencyInfo;

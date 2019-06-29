const _ = require('lodash');

const Currency = require('./currency');

function Account(obj) {
    obj = obj || {};

    this.id = obj.id || '';
    this.balance = !_.isNil(obj.balance) ? obj.balance : 0 ;
    this.creditLimit = !_.isNil(obj.creditLimit) ? obj.creditLimit : 0;
    this.currencyCode = !_.isNil(obj.currencyCode) ? obj.currencyCode : null;
    this.currency = !_.isNil(this.currencyCode) ? new Currency(obj.currencyCode) : null;
    this.cashbackType = obj.cashbackType;
    this.defaultAccount = this.currencyCode === Currency.defaultCurrencyCode || false;
}

Account.prototype.getBalanceDisplay = function() {
    let balance = this.balance;
    return this.currency.getValueDisplay(balance);
};

Account.prototype.getCreditLimitDisplay = function() {
    let balance = this.creditLimit;
    return this.currency.getValueDisplay(balance);
};

Account.prototype.getUsedCreditDisplay = function() {
    let balance = this.balance - this.creditLimit;
    balance = balance < 0 ? Math.abs(balance) : 0;
    return this.currency.getValueDisplay(balance);
};

Account.prototype.getOwnBalanceDisplay = function() {
    let balance = this.balance - this.creditLimit;
    balance = balance > 0 ? balance : 0;
    return this.currency.getValueDisplay(balance);
};

module.exports = Account;

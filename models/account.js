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
    this.usedCreditBalance = getUsedCredit(this.balance, this.creditLimit);
    this.ownBalance = getOwnBalance(this.balance, this.creditLimit);
}

Account.prototype.getBalanceDisplay = function() {
    return this.currency.getValueDisplay(this.balance);
};

Account.prototype.getCreditLimitDisplay = function() {
    return this.currency.getValueDisplay(this.creditLimit);
};

Account.prototype.getUsedCreditDisplay = function() {
    return this.currency.getValueDisplay(this.usedCreditBalance);
};

Account.prototype.getOwnBalanceDisplay = function() {
    return this.currency.getValueDisplay(this.ownBalance);
};

function getUsedCredit(balance, creditLimit) {
    let value = balance - creditLimit;
    return value < 0 ? Math.abs(value) : 0;
}

function getOwnBalance(balance, creditLimit) {
    let value = balance - creditLimit;
    return value > 0 ? value : 0;
}

module.exports = Account;

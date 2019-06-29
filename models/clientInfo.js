const _ = require('lodash');

const Account = require('./account');

function ClientInfo(obj) {
    obj = obj || {};

    this.name = obj.name || '';
    this.accounts = _.isArray(obj.accounts) ? _.map(obj.accounts, (account) => new Account(account)) : [];
    this.defaultAccount = _.find(this.accounts, 'defaultAccount') || null;
}

module.exports = ClientInfo;

const _ = require('lodash');
const request = require('sync-request');

const Config = require('./api.config');
const CurrencyInfo = require('./models/currencyInfo');
const ClientInfo = require('./models/clientInfo');

const API = {};
const apiEndpoints = {
    bank: {
        scope: 'bank',
        path: {
            currency: 'currency',
        },
        token: false,
    },
    personal: {
        scope: 'personal',
        path: {
            clientInfo: 'client-info',
            statement: 'statement',
        },
        token: true,
    },
};

API.timeLimit = 60;

API.getCurrency = function () {
    const data = _request('GET', 'bank', 'currency');
    if (data !== false && !_.isEmpty(data)) {
        return _.map(data, (d) => new CurrencyInfo(d));
    }
    return [];
};

API.getClientInfo = function () {
    const data = _request('GET', 'personal', 'clientInfo');
    if (data !== false && !_.isEmpty(data)) {
        return new ClientInfo(data);
    }
    return [];
};

API.getStatementRaw = function (from, to, account = '0') {
    let params = `${account}${from ? '/' + from : ''}${to ? '/' + to : ''}`;
    const data = _request('GET', 'personal', 'statement', params);
    if (data !== false && !_.isEmpty(data)) {
        return data;
    }
    return [];
};

function _request(method = 'GET', scope = 'bank', path = 'currency', params = '') {
    const headers = {};
    const options = {};
    let pathOption = `/${apiEndpoints[scope].scope}/${apiEndpoints[scope].path[path]}`;
    pathOption += params.length ? `/${params.toString()}` : '';
    const url = `${Config.apiHost}${pathOption}`;

    if (apiEndpoints[scope].token === true) {
        headers['X-Token'] = Config.apiToken;
    }
    if (!_.isEmpty(headers)) {
        options.headers = headers;
    }

    const res = request(method, url, options);

    return _getBody(res);
}

function _getBody(res) {
    let result = {};
    try {
        result = res.getBody('utf8');
    } catch (e) {
        return _errorHandler(e);
    }

    return !_.isEmpty(result) ? JSON.parse(result) : {};
}

function _errorHandler(res) {
    let error = res.body.toString('utf8');
    if (error.length) {
        error = JSON.parse(error);
        if (!_.isEmpty(error) && error.errorDescription) {
            console.log(res.statusCode, error.errorDescription);
        }
    }

    return false;
}

module.exports = API;

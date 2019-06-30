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
        },
        token: true,
    },
};

API.getCurrency = () => {
    const data = _request('GET', 'bank', 'currency');
    if (data !== false && !_.isEmpty(data)) {
        return _.map(data, (d) => new CurrencyInfo(d));
    }
    return [];
};

API.getClientInfo = () => {
    const data = _request('GET', 'personal', 'clientInfo');
    if (data !== false && !_.isEmpty(data)) {
        return new ClientInfo(data);
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
        result = JSON.parse(res.getBody('utf8'));
    } catch (e) {
        return _errorHandler(res);
    }

    return result;
}

function _errorHandler() {
    // TODO
    return false;
}

module.exports = API;

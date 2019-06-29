const https = require('https');
const _ = require('lodash');

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

API.getCurrency = async () => {
    const currencyRates = await _request();
    if (!_.isEmpty(currencyRates)) {
        return _.map(currencyRates, (currencyRate) => new CurrencyInfo(currencyRate));
    }
    return [];
};

API.getClientInfo = async () => {
    const clientInfo = await _request('GET', 'personal', 'clientInfo');
    if (!_.isEmpty(clientInfo)) {
        return new ClientInfo(clientInfo);
    }
    return [];
};

function _request(method = 'GET', scope = 'bank', path = 'currency', params = '') {
    return new Promise((resolve, reject) => {
        let headers = {};
        let pathOption = `/${apiEndpoints[scope].scope}/${apiEndpoints[scope].path[path]}`;
        pathOption += params.length ? `/${params.toString()}` : '';
        const options = {
            hostname: Config.apiHost,
            path: pathOption,
            method: method,
        };
        if (apiEndpoints[scope].token === true) {
            headers['X-Token'] = Config.apiToken;
        }
        if (!_.isEmpty(headers)) {
            options.headers = headers;
        }

        const req = https.request(options, (res) => {
            let body = '';

            res.on('data', (d) => {
                body += d;
            });

            res.on('end', () => {
                resolve(JSON.parse(body));
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
}

module.exports = API;

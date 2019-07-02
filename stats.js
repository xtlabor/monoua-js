#!/usr/bin/env /Users/labor/.nvm/versions/node/v10.15.1/bin/node

const _ = require('lodash');
const fs = require('fs');
const moment = require('moment');
const API = require('./api');
const Config = require('./api.config');

const statementFile = fs.openSync('cache/statement.json', 'a+');
const statementData = fs.readFileSync(statementFile, 'utf8');

const now = moment();
let data = {};
let Data = statementData.length ? JSON.parse(statementData) : {};

if (Data.lastCall && (now.unix() - Data.lastCall) <= API.timeLimit) {
    const leftTime = API.timeLimit - (now.unix() - Data.lastCall);
    console.log(`Please retry in ${leftTime} second(s)`);
    return false;
}

let endTime = moment().startOf('month').unix();
// const distance = endDate.diff(startDate, 'months');

let startMonthDate = moment(Config.cacheStartDate, 'YYYY-MM-DD').startOf('month');
let startMonthTime = startMonthDate.unix();
let endMonthDate = moment(Config.cacheStartDate, 'YYYY-MM-DD').endOf('month');
let endMonthTime = endMonthDate.unix();

let i = 0;
let isFull = true;
while (endTime > startMonthTime) {
    startMonthDate = startMonthDate.add(i > 0 ? 1 : 0, 'months').startOf('month');
    startMonthTime = startMonthDate.unix();
    endMonthDate = endMonthDate.add(i > 0 ? 1 : 0, 'months').endOf('month');
    endMonthTime = endMonthDate.unix();

    if (Data.data && !_.isEmpty(Data.data) && _.has(Data.data, startMonthTime)) {
        console.log(`${startMonthDate.format('YYYY-MM')} - Exists`);
    } else {
        const statement = API.getStatementRaw(startMonthTime, endMonthTime) || {};
        if (!_.isEmpty(statement)) {
            isFull = false;
            console.log(`${startMonthDate.format('YYYY-MM')} - Added`);
            data[startMonthTime] = statement;
        }
        break;
    }

    i++;
}

Data.lastCall = now.unix();
Data.data = _.assign(Data.data, data);

fs.writeFileSync('cache/statement.json', JSON.stringify(Data));

if (isFull) {
    console.log(`It's full!`);
}

return;

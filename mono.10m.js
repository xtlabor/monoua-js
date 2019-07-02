#!/usr/bin/env /Users/labor/.nvm/versions/node/v10.15.1/bin/node

/*
* <bitbar.title>MonoUA Stat JS</bitbar.title>
* <bitbar.version>v1.0</bitbar.version>
* <bitbar.author>Mykola Plashenko</bitbar.author>
* <bitbar.author.github>xtlabor</bitbar.author.github>
* <bitbar.image></bitbar.image>
* <bitbar.desc></bitbar.desc>
* <bitbar.dependencies>node,lodash</bitbar.dependencies>
*/

const _ = require('lodash');
const Bar = require('bitbar');
const API = require('./api');

const barData = [];
const barOptions = {};
let _Client = {};

const titleIcon = 'iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAADJ0lEQVR4AWKgKRgF3t7eJgkJCfZEKS4rKzP08PDIT01NtSZGfX' +
    '19vYixsfElLS2tPdbW1qYENQgICMy0sbHZx8LC8t/Ozu6miopKLD71gPaqIcDNMArW1uJP1nactW0Ga9u2bZ9q+1LbtnmveandTrAOimvDz/PezL' +
    'zvt7Ky6qfT6THIQhtrL3/8+HGyTIDg4OAuV1dXX3d39yRsvhkYGLiMQqFcdnR0dBq/dvXq1QSivzrU9/PzGyAIIlomgK2tbSgOqxG0AwIC3Nhs9l' +
    'H8G1Op1O0WFhZrORxOUmho6CCml7q4uJy0tLTcW15eLqQzJSWFYLFY52UCVFRU6GPR7qF+RkaGn5aWVpWXl9cta2vrvXp6ekUQ1HvKlCnmiNjOzc' +
    '0tw8bGZjW+92NjY9uhwy4AOcgEcXZ2vjvU1tbWJnJzc/MiIiLmj17T0dGhBd61hvqbN2+eBnOkmpqavga9y2QCaGpqLsnOzhamraampow/Jr4sLp' +
    'drOrQG81Q7O7vjyKIfOgj18fX1NQNdRaD5LcApUgGwKZRiRqkXtJGyBaJ6BSrWwl270P8A0XdHRkbGAOBWWlpaBrQ5p6ur+5TBYOzB/EMcHiUwxs' +
    '+fPyU7Cova8Bc11Ae/HXBTLCiwMzIyutTW1kaF+G8h9qpjx45FgdLHJiYmWxFEH/Z2CfYYGxv3gdYQad6+fPz48blD/ZCQEGVEexsAFXDYAOYvzZ' +
    'gxI62woJBpaGj4GuNLAXAZrtqI5XMEe1AbTqBuQCIANu0TWG70GKhQBEgKnJRWXFysPTQOKq5LOkNBQcGCTCYvlQgA59TAinHyqh41wYI+35hMJj' +
    'F+jsfjVUH0VIkbGxoayLiLPEtLS+fKqHhVGo1239PTMxcH9Yye6+3t1USmt4esLfEFYWMh2Jna2lqSpPmcnJx5RUVF1PHja9euVUVGx9CUWWxDYn' +
    'vCIXcgWGloWKiivPXQKQg63YEBHH/7rm9paZmL+yYL3r5GIpEOwjH9CxcuTIOzklB4sSjKNPi/E465jGBWg1b1v36wgBLlmJgYLzTTwH82LsAcQR' +
    'uG8N25c6fC/0fvP71+AVDd+A96CWoiAAAAAElFTkSuQmCC';
const warningIcon = '⚠️';

renderPlugin();

function renderPlugin() {
    const data = getData();

    const header = {text: '', image: titleIcon};
    const menu = [];
    const refresh = {text: 'Обновить', refresh: true};

    if (data === false) {
        header.text = `${warningIcon} Ошибка`;
        header.color = 'red';
    } else {
        if (!_.isEmpty(data.client)) {
            menu.push(...data.client);
            menu.push(Bar.separator);
        }
        if (!_.isEmpty(data.currency)) {
            menu.push(...data.currency);
            menu.push(Bar.separator);
        }
    }

    barData.push(header);
    barData.push(Bar.separator);
    barData.push(...menu);
    barData.push(refresh);

    barOptions.color = Bar.darkMode ? 'white' : 'red';

    Bar(barData, barOptions);
}

function getData() {
    const currencyInfo = API.getCurrency();
    _Client = API.getClientInfo();

    return {
        currencyInfo,
        currency: _getCurrency(currencyInfo),
        clientInfo: _Client,
        client: _getClient(_Client),
    };
}

function _getClient(clientData) {
    const fontSizeLabel = 10;
    const fontSizeValue = 12;
    const Menu = [];
    const accountsMenu = [];
    _.forEach(clientData.accounts, (account) => {
        accountsMenu.push({
            text: `${account.currency.name} - ${account.getBalanceDisplay()}`,
            size: fontSizeValue,
            submenu: _getAccountMenu(account, fontSizeLabel, fontSizeValue),
        });
    });

    Menu.push({text: clientData.name});
    Menu.push(Bar.separator);

    Menu.push(..._getAccountMenu(clientData.defaultAccount, fontSizeLabel, fontSizeValue));

    Menu.push(Bar.separator);
    Menu.push({text: `Кошельки`, submenu: accountsMenu});

    return Menu;
}

function _getAccountMenu(data, fontSizeLabel = 12, fontSizeValue = 10) {
    const menu = [];

    menu.push({text: `Баланс:`, size: fontSizeLabel});
    menu.push({text: data.getBalanceDisplay(), size: fontSizeValue});
    menu.push(Bar.separator);
    menu.push({text: `Личные средства:`, size: fontSizeLabel});
    menu.push({text: data.getOwnBalanceDisplay(), size: fontSizeValue});
    menu.push(Bar.separator);
    menu.push({text: `Кредитный лимит:`, size: fontSizeLabel});
    menu.push({text: data.getCreditLimitDisplay(), size: fontSizeValue});
    menu.push(Bar.separator);
    menu.push({text: `Использовано кредита:`, size: fontSizeLabel});
    menu.push({text: data.getUsedCreditDisplay(), size: fontSizeValue});

    return menu;
}

function _getCurrency(currencyInfos) {
    const currency = [];
    currency.push({
        text: 'Курс валют',
        submenu: _getCurrencySubMenu(currencyInfos),
    });

    return currency;
}

function _getCurrencySubMenu(currencyInfos) {
    const fontSizeLabel = 10;
    const fontSizeValue = 12;
    const menu = [];
    _.forEach(currencyInfos, (currencyInfo) => {
        const currencyMenu = {};
        currencyMenu.text = `${currencyInfo.currencyA.name} → ${currencyInfo.currencyB.name}`;
        currencyMenu.size = fontSizeValue;
        currencyMenu.submenu = [];
        if (currencyInfo.date) {
            currencyMenu.submenu.push({
                text: currencyInfo.getDate(),
                size: fontSizeValue,
            });
        }
        if (!_.isNil(currencyInfo.rateSell)) {
            currencyMenu.submenu.push(Bar.separator);
            currencyMenu.submenu.push({text: `Продажа:`, size: fontSizeLabel});
            currencyMenu.submenu.push({text: currencyInfo.getRate(currencyInfo.rateSell), size: fontSizeValue});
        }
        if (!_.isNil(currencyInfo.rateBuy)) {
            currencyMenu.submenu.push(Bar.separator);
            currencyMenu.submenu.push({text: `Покупка:`, size: fontSizeLabel});
            currencyMenu.submenu.push({text: currencyInfo.getRate(currencyInfo.rateBuy), size: fontSizeValue});
        }
        if (!_.isNil(currencyInfo.rateCross)) {
            currencyMenu.submenu.push(Bar.separator);
            currencyMenu.submenu.push({text: `Кросс-курс:`, size: fontSizeLabel});
            currencyMenu.submenu.push({text: currencyInfo.getRate(currencyInfo.rateCross), size: fontSizeValue});
        }
        menu.push(currencyMenu);
    });

    return menu;
}

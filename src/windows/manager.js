/**
 * Created by zhaofeng on 7/14/16.
 */
const MainWindow = require('./main.win');
const LoginWindow = require('./login.win');

let openWinMap = {};

exports.create = function (winName) {
    let win = null;
    switch (winName) {
        case 'main':
            win = new MainWindow();
            break;
        case 'login':
            win = new LoginWindow(openWinMap['main']);
    }

    win && (openWinMap[winName] = win);
    return win;
};

exports.getWin = function (winName) {
    return openWinMap[winName];
};

exports.close = function (winName) {
    if (openWinMap[winName]) {
        openWinMap[winName].close();
        delete openWinMap[winName];
    }
};
/**
 * Created by zhaofeng on 7/14/16.
 */
const MainWindow = require('./main.win');
const LoginWindow = require('./login.win');
const AboutWindow = require('./about.win');

let openWinMap = {};

exports.create = function (winName) {
    let win = null;
    switch (winName) {
        case 'main':
            win = new MainWindow();
            break;
        case 'login':
            win = new LoginWindow(openWinMap['main']);
            break;
        case 'about':
            win = new AboutWindow(openWinMap['main']);
            break;
    }

    win && (openWinMap[winName] = win);
    win && win.on('close', () => {
        delete openWinMap[winName];
    });

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
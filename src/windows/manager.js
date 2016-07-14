/**
 * Created by zhaofeng on 7/14/16.
 */
const MainWindow = require('./main.win');

let openWinMap = {};

exports.create = function (winName, path) {
    let win = null;
    switch (winName) {
        case 'main':
            win = new MainWindow(path);
            break;
    }

    win && (openWinMap[winName] = win);
    return win;
};
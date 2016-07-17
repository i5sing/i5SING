/**
 * Created by zhaofeng on 7/15/16.
 */
const ipc = require('../backend/ipc');
const WinManager = require('./manager');

exports.registerEvent = function () {
    ipc.main.on('open-login-win', function (event) {
        WinManager.create('login');
    });

    ipc.main.on('login-success', function (event, info) {
        let win = WinManager.getWin('main');
        WinManager.close('login');
        ipc.send(win, 'login-success-to-main-win', info);
    });

    ipc.main.on('go-back-forward', function (event, type) {
        let win = WinManager.getWin('main');
        if (type == 'back' && win.webContents.canGoBack()) {
            win.webContents.goBack();
        } else if (type == 'forward' && win.webContents.canGoForward()) {
            win.webContents.goForward();
        }
    })
};
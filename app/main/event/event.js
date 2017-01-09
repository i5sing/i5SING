/**
 * Created by zhaofeng on 7/15/16.
 */
const {on, broadcast} = require('../../common/event');
const WinManager = require('./../win/manager');

exports.registerEvent = function () {
    on('open-login-win', function () {
        WinManager.create('login');
    });

    on('login-success', function (event, info) {
        let win = WinManager.getWin('main');
        WinManager.close('login');
        broadcast(win, 'login-success-to-main-win', info);
    });

    on('go-back-forward', function (event, type) {
        let win = WinManager.getWin('main');
        if (type == 'back' && win.webContents.canGoBack()) {
            win.webContents.goBack();
        } else if (type == 'forward' && win.webContents.canGoForward()) {
            win.webContents.goForward();
        }
    });

    on('close-win', function (event, winType) {
        WinManager.close(winType);
    })
};
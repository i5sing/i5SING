/**
 * Created by zhaofeng on 7/11/16.
 */
const {app} = require('electron');
const WindowsManager = require('./windows/manager');
const Event = require('./windows/event');
const Tray = require('./windows/tray');

let win, tray;

app.on('ready', () => {
    win = WindowsManager.create('main');
    win.on('closed', () => {
        win = null;
    });

    tray = Tray.createTray();

    Event.registerEvent();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        tray.destroy();
        app.quit();
    }
});

app.on('activate', () => {

});
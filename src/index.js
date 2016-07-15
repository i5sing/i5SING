/**
 * Created by zhaofeng on 7/11/16.
 */
const {app} = require('electron');
const WindowsManager = require('./windows/manager');
const Event = require('./windows/event');

let win;

app.on('ready', () => {
    win = WindowsManager.create('main');
    win.on('closed', () => {
        win = null;
    });

    Event.registerEvent();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {

});
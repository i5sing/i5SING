/**
 * Created by zhaofeng on 2016/8/1.
 */
const {app} = require('../common/electron');
const WindowsManager = require('./win/manager');
const Event = require('./event/event');
const Tray = require('./menu/tray');

let win, tray;

app.on('ready', () => {
    win = WindowsManager.create('main');

    tray = Tray.createTray(win);

    Event.registerEvent();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        tray.destroy();
        app.exit(0);
    }
});

app.on('activate', () => {
    if (win === null) {
        win = WindowsManager.create('main');
    } else {
        win.show();
    }
});
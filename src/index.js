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
    win.on('close', (e) => {
        if (win.isVisible()) {
            e.preventDefault();
            win.hide();
        }
    });

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
    if (win == null) {
        win = WindowsManager.create('main');
    } else {
        win.show();
    }
});
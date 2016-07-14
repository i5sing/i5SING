/**
 * Created by zhaofeng on 7/11/16.
 */
const {app} = require('electron');
const WindowsManager = require('./windows/manager');

let win;

app.on('ready', () => {
    win = WindowsManager.create('main', `file://${__dirname}/index.html`);
    win.on('closed', () => {
        win = null;
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
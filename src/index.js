/**
 * Created by zhaofeng on 7/11/16.
 */
const electron = require('electron');
const {app} = electron;
const {BrowserWindow, Menu} = electron;

const menu = require('./backend/menu');

let win;

function createWindow() {
    win = new BrowserWindow({
        frame: false,
        resizable: false,
        height: 670,
        width: 980
    });

    win.loadURL(`file://${__dirname}/index.html`);

    if (process.env.NODE_ENV && process.env.NODE_ENV == 'dev') {
        win.webContents.openDevTools();
    }

    win.on('closed', () => {
        win = null;
    });

    if (process.platform == "darwin") {
        Menu.setApplicationMenu(menu);
    }
}

app.on('ready', createWindow);

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

global.terminate = function () {
    app.quit();
};

global.lang = app.getLocale();
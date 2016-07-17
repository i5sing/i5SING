/**
 * Created by zhaofeng on 7/14/16.
 */
const {BrowserWindow, globalShortcut}  = require('electron');

const MenuBuilder = require('./menu');
const ipc = require('../backend/ipc');

class MainWindows {
    constructor() {
        this.win = new BrowserWindow({
            frame: false,
            resizable: false,
            height: 670,
            width: 980
        });
        this.win.loadURL(`file://${__dirname}/index.html`);

        if (process.env.NODE_ENV && process.env.NODE_ENV == 'dev') {
            this.win.webContents.openDevTools();
        }

        if (process.platform == "darwin") {
            MenuBuilder.build(this.win);
        }

        //注册快捷键
        globalShortcut.register('MediaNextTrack', () => {
            ipc.send(this.win, 'change-song', 'next');
        });
        globalShortcut.register('MediaPreviousTrack', () => {
            ipc.send(this.win, 'change-song', 'pre');
        });
        globalShortcut.register('MediaPlayPause', () => {
            ipc.send(this.win, 'change-song', 'play');
        });

        return this.win;
    }
}

module.exports = MainWindows;
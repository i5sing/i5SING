/**
 * Created by zhaofeng on 7/14/16.
 */
const {BrowserWindow, globalShortcut}  = require('../../common/electron');
const {broadcast} = require('../../common/event');
const MenuBuilder = require('../menu/menu');

class MainWindows {
    constructor() {
        this.win = new BrowserWindow({
            frame: false,
            resizable: false,
            height: 670,
            width: 980,
            center: true,
            titleBarStyle: 'hidden-inset'
        });

        this.win.loadURL(`file://${__dirname}/views/index.html`);

        this.win.webContents.clearHistory();

        this.win.webContents.on('did-finish-load', () => {
            this.win.webContents.clearHistory();
        });

        if (process.platform == "darwin") {
            MenuBuilder.build(this.win);
        }

        this.win.on('close', (e) => {
            if (this.win.isVisible()) {
                e.preventDefault();
                this.win.hide();
            }
        });

        //注册快捷键
        globalShortcut.register('MediaNextTrack', () => {
            broadcast(this.win, 'change-song', 'next');
        });
        globalShortcut.register('MediaPreviousTrack', () => {
            broadcast(this.win, 'change-song', 'pre');
        });
        globalShortcut.register('MediaPlayPause', () => {
            broadcast(this.win, 'change-song', 'play');
        });

        return this.win;
    }
}

module.exports = MainWindows;
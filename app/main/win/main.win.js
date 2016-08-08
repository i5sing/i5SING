/**
 * Created by zhaofeng on 7/14/16.
 */
const {BrowserWindow, globalShortcut}  = require('../../common/electron');
const {send} = require('../../common/event');
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
            send(this.win, 'change-song', 'next');
        });
        globalShortcut.register('MediaPreviousTrack', () => {
            send(this.win, 'change-song', 'pre');
        });
        globalShortcut.register('MediaPlayPause', () => {
            send(this.win, 'change-song', 'play');
        });

        return this.win;
    }
}

module.exports = MainWindows;
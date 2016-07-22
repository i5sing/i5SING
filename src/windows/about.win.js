/**
 * Created by zhaofeng on 21/07/2016.
 */
const {BrowserWindow}  = require('electron');

class AboutWindow {
    constructor(parent) {
        this.win = new BrowserWindow({
            frame: true,
            resizable: false,
            height: 250,
            width: 300,
            alwaysOnTop: true,
            parent: parent
        });

        this.win.loadURL(`file://${__dirname}/about.html`);

        return this.win;
    }
}

module.exports = AboutWindow;
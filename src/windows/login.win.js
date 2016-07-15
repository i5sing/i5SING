/**
 * Created by zhaofeng on 7/14/16.
 */
const {BrowserWindow}  = require('electron');

class LoginWindows {
    constructor(parent) {
        this.win = new BrowserWindow({
            frame: true,
            resizable: false,
            height: 250,
            width: 300,
            alwaysOnTop: true,
            parent: parent
        });

        this.win.loadURL(`file://${__dirname}/login.html`);

        return this.win;
    }
}

module.exports = LoginWindows;
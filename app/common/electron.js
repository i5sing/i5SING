/**
 * Created by zhaofeng on 7/11/16.
 */
const {
    BrowserWindow,
    remote,
    app,
    ipcMain,
    Menu,
    shell,
    Tray,
    globalShortcut
} = require('electron');

module.exports = {
    BrowserWindow: BrowserWindow,
    remote: remote,
    app: app,
    ipcMain: ipcMain,
    Menu: Menu,
    shell: shell,
    Tray: Tray,
    globalShortcut: globalShortcut
};
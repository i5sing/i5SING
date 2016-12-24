/**
 * Created by zhaofeng on 2016/8/1.
 */
const {ipcMain} = require('./electron');

/**
 * broadcast
 * @param win
 * @param args
 * @returns {boolean}
 */
exports.broadcast = function (win, ...args) {
    if (!win) return false;
    //noinspection JSUnresolvedVariable
    win.webContents.send(...args);
};

/**
 * on
 * @param channel
 * @param listener
 * @type {*|noop}
 */
exports.on = function (channel, listener) {
    ipcMain.on(channel, listener);
};

/**
 * once
 * @param channel
 * @param listener
 * @type {*|noop}
 */
exports.once = function (channel, listener) {
    ipcMain.once(channel, listener);
};

/**
 * removeListener
 * @param channel
 * @param listener
 */
exports.removeListener = function (channel, listener) {
    ipcMain.removeListener(channel, listener);
};

/**
 * removeAllListeners
 * @param channel
 */
exports.removeAllListeners = function (channel) {
    ipcMain.removeAllListeners(channel);
};
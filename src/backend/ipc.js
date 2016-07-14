/**
 * Created by zhaofeng on 7/14/16.
 */
const {ipcRenderer, ipcMain} = require('electron');

exports.main = {};
exports.render = {};

/**
 * on
 * @param channel
 * @param listener
 * @type {*|noop}
 */
exports.render.on = function (channel, listener) {
    ipcRenderer.on(channel, listener);
};

/**
 * once
 * @param channel
 * @param listener
 * @type {*|noop}
 */
exports.render.once = function (channel, listener) {
    ipcRenderer.once(channel, listener);
};

/**
 * send
 * @param channel
 * @param args
 */
exports.render.send = function (channel, ...args) {
    ipcRenderer.send.apply(this, arguments);
};

/**
 * sendSync
 * @param channel
 * @param args
 */
exports.render.sendSync = function (channel, ...args) {
    ipcRenderer.sendSync.apply(this, arguments);
};

/**
 * sendToHost
 * @param channel
 * @param args
 */
exports.render.sendToHost = function (channel, ...args) {
    ipcRenderer.sendToHost.apply(this, arguments);
};

/**
 * removeListener
 * @param channel
 * @param listener
 */
exports.render.removeListener = function (channel, listener) {
    ipcRenderer.removeListener(channel, listener);
};

/**
 * removeAllListeners
 * @param channel
 */
exports.render.removeAllListeners = function (channel) {
    ipcRenderer.removeAllListeners(channel);
};

/**
 * on
 * @param channel
 * @param listener
 * @type {*|noop}
 */
exports.main.on = function (channel, listener) {
    ipcMain.on(channel, listener);
};

/**
 * once
 * @param channel
 * @param listener
 * @type {*|noop}
 */
exports.main.once = function (channel, listener) {
    ipcMain.once(channel, listener);
};

/**
 * removeListener
 * @param channel
 * @param listener
 */
exports.main.removeListener = function (channel, listener) {
    ipcRenderer.removeListener(channel, listener);
};

/**
 * removeAllListeners
 * @param channel
 */
exports.main.removeAllListeners = function (channel) {
    ipcRenderer.removeAllListeners(channel);
};

/**
 * send
 * @param win
 * @param channel
 * @param args
 * @returns {boolean}
 */
exports.send = function (win, channel, ...args) {
    if (!win) return false;
    let _args = [].slice.call(arguments);
    _args.shift();
    win.webContents.send.apply(this, _args);
};
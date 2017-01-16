/**
 * Created by zhaofeng on 2016/8/1.
 */
import {ipcMain} from 'electron';

/**
 * broadcast
 * @param win
 * @param args
 * @returns {boolean}
 */
export function broadcast(win, ...args) {
    if (!win) return false;
    //noinspection JSUnresolvedVariable
    win.webContents.send(...args);
}

/**
 * on
 * @param channel
 * @param listener
 * @type {*|noop}
 */
export function on(channel, listener) {
    ipcMain.on(channel, listener);
}

/**
 * once
 * @param channel
 * @param listener
 * @type {*|noop}
 */
export function once(channel, listener) {
    ipcMain.once(channel, listener);
}

/**
 * removeListener
 * @param channel
 * @param listener
 */
export function removeListener(channel, listener) {
    ipcMain.removeListener(channel, listener);
}

/**
 * removeAllListeners
 * @param channel
 */
export function removeAllListeners(channel) {
    ipcMain.removeAllListeners(channel);
}
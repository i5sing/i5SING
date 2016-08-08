/**
 * Created by zhaofeng on 2016/8/1.
 */
const {ipcRenderer} = require('electron');

/**
 * on
 * @param channel
 * @param listener
 * @type {*|noop}
 */
export function on(channel, listener) {
    ipcRenderer.on(channel, listener);
}

/**
 * once
 * @param channel
 * @param listener
 * @type {*|noop}
 */
export function once(channel, listener) {
    ipcRenderer.once(channel, listener);
}

/**
 * send
 * @param channel
 * @param args
 */
export function send(channel, ...args) {
    ipcRenderer.send.apply(this, arguments);
}

/**
 * sendSync
 * @param channel
 * @param args
 */
export function sendSync(channel, ...args) {
    ipcRenderer.sendSync.apply(this, arguments);
}

/**
 * sendToHost
 * @param channel
 * @param args
 */
export function sendToHost(channel, ...args) {
    ipcRenderer.sendToHost.apply(this, arguments);
}

/**
 * removeListener
 * @param channel
 * @param listener
 */
export function removeListener(channel, listener) {
    ipcRenderer.removeListener(channel, listener);
}

/**
 * removeAllListeners
 * @param channel
 */
export function removeAllListeners(channel) {
    ipcRenderer.removeAllListeners(channel);
}
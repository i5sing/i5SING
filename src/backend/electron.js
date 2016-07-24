/**
 * Created by zhaofeng on 7/11/16.
 */
const {BrowserWindow, remote} = require('electron');

exports.getFocusWindowId = function () {
    return BrowserWindow.getFocusedWindow().id;
};

exports.getRemote = function () {
    return remote;
};
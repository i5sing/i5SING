/**
 * Created by zhaofeng on 7/11/16.
 */
const {BrowserWindow} = require('electron');

exports.getFocusWindowId = function () {
    return BrowserWindow.getFocusedWindow().id;
};
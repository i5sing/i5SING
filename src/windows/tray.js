/**
 * Created by zhaofeng on 2016/7/22.
 */
const {Menu, Tray} = require('electron');
const path = require('path')


exports.createTray = function () {
    const iconName = process.platform === 'win32' ? 'tray.png' : 'tray.png';
    const iconPath = path.join(__dirname, '../assets', iconName);
    let tray = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([

    ]);
    tray.setToolTip('5SING');
    tray.setContextMenu(contextMenu);

    return tray;
};
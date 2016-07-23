/**
 * Created by zhaofeng on 2016/7/22.
 */
const {Menu, Tray} = require('electron');
const path = require('path');

exports.createTray = function (win) {
    const iconName = process.platform === 'win32' ? 'tray.png' : 'tray.png';
    const iconPath = path.join(__dirname, '../assets', iconName);
    let tray = new Tray(iconPath);
    tray.setToolTip('5SING');
    // const contextMenu = Menu.buildFromTemplate([]);
    // tray.setContextMenu(contextMenu);

    tray.on('click', (e) => {
        if (!win.isVisible()) {
            e.preventDefault();
            win.show();
        }
    });

    return tray;
};
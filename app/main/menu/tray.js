/**
 * Created by zhaofeng on 2016/7/22.
 */
const {Menu, Tray} = require('../../common/electron');
const path = require('path');

exports.createTray = function (win) {
    const iconName = process.platform === 'win32' ? 'tray.png' : 'tray.png';
    const iconPath = path.join(__dirname, '../../assets/img', iconName);
    let tray = new Tray(iconPath);
    tray.setToolTip('i5SING');
    // const contextMenu = Menu.buildFromTemplate([]);
    // tray.setContextMenu(contextMenu);

    tray.on('click', (e) => {
        if (!win.isVisible()) {
            e.preventDefault();
            win.show();
        } else {
            win.focus();
        }
    });

    return tray;
};
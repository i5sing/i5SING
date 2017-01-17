/**
 * Created by zhaofeng on 2016/7/22.
 */
const {Menu, Tray} = require('electron');
const {tray} = require('../../platform');

exports.createTray = function (win) {
    let trayObj = new Tray(tray.getTrayImage());
    trayObj.setToolTip('i5SING');
    const contextMenu = Menu.buildFromTemplate(tray.getMenuTemplate(win));
    trayObj.popUpContextMenu(contextMenu);

    trayObj.on('click', e => {
        if (!win.isVisible()) {
            e.preventDefault();
            win.show();
        } else {
            win.focus();
        }
    });

    trayObj.on('right-click', e => {
        trayObj.popUpContextMenu();
    });

    return trayObj;
};
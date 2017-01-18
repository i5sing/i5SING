/**
 * Created by zhaofeng on 2016/7/22.
 */
const {Menu, Tray} = require('electron');
const {tray} = require('../../platform');
import {getSystem} from '../../utils/system';

exports.createTray = function (win) {
    let trayObj = new Tray(tray.getTrayImage());
    trayObj.setToolTip('i5SING');
    const contextMenu = Menu.buildFromTemplate(tray.getMenuTemplate(win));

    // click event is invalid when use setContextMenu in osx.
    getSystem() == 'win32' ?
        trayObj.setContextMenu(contextMenu) :
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
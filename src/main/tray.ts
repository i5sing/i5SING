import { Tray, BrowserWindow, Menu } from 'electron';
import { resolve } from "path";
import { initMacMenu } from "./menu";

export const initTray = (window: BrowserWindow) => {
    const platform = process.platform;
    const image = platform === 'darwin' ?
        resolve(__dirname, '../../src/assets/tray/trayTemplate.png') :
        resolve(__dirname, '../../src/assets/tray/tray.png');
    const trayObj = new Tray(image);
    trayObj.setToolTip('i5SING');

    const contextMenu = Menu.buildFromTemplate(platform === 'darwin' ? initMacMenu(window) : []);
    platform == 'win32' ? trayObj.setContextMenu(contextMenu) : trayObj.popUpContextMenu(contextMenu);

    trayObj.on('click', e => {
        if (!window.isVisible()) {
            e.preventDefault();
            window.show();
        } else {
            window.focus();
        }
    });

    trayObj.on('right-click', e => {
        trayObj.popUpContextMenu();
    });

    return trayObj;
};

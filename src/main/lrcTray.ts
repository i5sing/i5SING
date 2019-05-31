import { Tray, BrowserWindow } from 'electron';
import { resolve } from "path";

export const initLrcTray = (window: BrowserWindow) => {
    const platform = process.platform;
    if (platform === 'darwin') {
        const trayObj = new Tray(resolve(__dirname, '../../src/assets/tray/empty.png'));
        trayObj.setTitle('');
        return trayObj;
    }

    return void 0;
};

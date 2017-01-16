/**
 * Created by zhaofeng on 7/14/16.
 */
import {BrowserWindow} from 'electron';
import {getNodeENV, DEVELOPMENT, PRODUCTION} from '../../utils/system';

export default class LoginWindows {
    constructor(parent) {
        this.win = new BrowserWindow({
            frame: false,
            resizable: false,
            height: 270,
            width: 300,
            center: true,
            alwaysOnTop: true,
            parent: parent
        });

        this.win.loadURL(`file://${__dirname}/../views/login.html`);

        return this.win;
    }
}
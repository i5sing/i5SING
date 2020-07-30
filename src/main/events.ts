import { ipcMain, nativeImage, Notification } from "electron";
import {
    GET_STORE_CACHE_EVENT,
    LOGOUT_EVENT,
    OPEN_LOGIN_WINDOW,
    SEND_STORE_CACHE_EVENT, SONG_NOTIFY_EVENT,
    SYNC_CACHE_EVENT, SYNC_LRC_EVENT
} from "../constants/Events";
import { REDUX_STORE } from "../constants/Store";
import { LoginWindow } from "./windows/LoginWindow";
import { MainWindow } from "./windows/MainWindow";
import { Store } from "./stores/Store";

export const registerEvents = (store: Store) => {
    ipcMain.on(GET_STORE_CACHE_EVENT, (event) => {
        event.returnValue = store.get(REDUX_STORE);
    });
    ipcMain.on(SEND_STORE_CACHE_EVENT, (event, data) => {
        store.set(REDUX_STORE, data);
    });
    ipcMain.on(OPEN_LOGIN_WINDOW, evt => {
        if (!LoginWindow.getInstance()) {
            LoginWindow.create(MainWindow.getInstance());
        }
    });
    ipcMain.on(LOGOUT_EVENT, evt => {
        store.set(REDUX_STORE, void 0);
    });
    ipcMain.on(SYNC_CACHE_EVENT, () => {
        setTimeout(() => {
            store.sync();
        }, 0);
    });
    ipcMain.on(SYNC_LRC_EVENT, (evt, lrc) => {
        if (!lrc) {
            lrc = { text: '' };
        }
        const tray = MainWindow.getLrcTray();
        if (tray && (lrc.text || tray.getTitle() && !lrc.text)) {
            tray.setTitle(lrc.text);
        }
    });
    ipcMain.on(SONG_NOTIFY_EVENT, (evt, { title, body, icon }) => {
        if (Notification.isSupported()) {
            const notification = new Notification({
                title,
                body,
                icon: nativeImage.createFromDataURL(icon),
                silent: true,
                // closeButtonText: '跳过'
            });
            notification.show();
            notification.on('close', () => {
            });
        }
    });
}

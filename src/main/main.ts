import { bootstrap } from "./app";
import { app, ipcMain } from 'electron';
import { Store } from "./stores/Store";
import { AuthService, CloudService, DownloadService, HistoryService, InitialService, LocalService } from "./services";
import { MainWindow } from "./windows/MainWindow";
import {
    GET_STORE_CACHE_EVENT,
    LOGOUT_EVENT,
    OPEN_LOGIN_WINDOW,
    SEND_STORE_CACHE_EVENT,
    SYNC_CACHE_EVENT, SYNC_LRC_EVENT
} from "../constants/Events";
import { REDUX_STORE } from "../constants/Store";
import { LoginWindow } from "./windows/LoginWindow";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let nestApp;
let store;

const createNestApp = async () => {
    await bootstrap(application => {
        const mainWindow = MainWindow.getInstance();

        nestApp = application;
        const authService: AuthService = nestApp.get(AuthService);
        const downloadService: DownloadService = nestApp.get(DownloadService);
        const localService: LocalService = nestApp.get(LocalService);
        const initialService: InitialService = nestApp.get(InitialService);
        const historyService: HistoryService = nestApp.get(HistoryService);
        const cloudService: CloudService = nestApp.get(CloudService);

        initialService.init(app, mainWindow, store);
        historyService.init(app, mainWindow);
        downloadService.init(app, mainWindow);
        localService.init(app, mainWindow);
        authService.init(app, mainWindow, store);
        cloudService.init(app, mainWindow, store);
    });
};

app.commandLine.appendSwitch('--autoplay-policy', 'no-user-gesture-required');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    await MainWindow.create();

    store = new Store(app.getPath('home'));
    await createNestApp();

    ipcMain.on(GET_STORE_CACHE_EVENT, (event) => {
        event.returnValue = store.get(REDUX_STORE);
    });
    ipcMain.on(SEND_STORE_CACHE_EVENT, (event, data) => {
        store.set(REDUX_STORE, data);
    });
    ipcMain.on(OPEN_LOGIN_WINDOW, evt => {
        LoginWindow.create(MainWindow.getInstance());
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
        if (tray) {
            tray.setTitle(lrc.text);
        }
    })
});

// Quit when all windows are closed.
app.on('window-all-closed', async () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        await nestApp.close();
        app.quit();
    }
});

let quiting = false;

app.on('before-quit', async (e) => {
    if (!quiting) {
        await nestApp.close();
        app.quit();
        e.preventDefault();
    }
});

app.on('activate', async () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (!MainWindow.isInitialized()) {
        await MainWindow.create();
    } else {
        MainWindow.getInstance().show();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

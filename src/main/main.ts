import { bootstrap } from "./app";
import { app } from 'electron';
import { Store } from "./stores/store";
import { AuthService, CloudService, DownloadService, HistoryService, InitialService, LocalService } from "./services";
import { MainWindow } from "./windows/main.window";
import { registerEvents } from "./events";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

app.disableHardwareAcceleration();

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

        initialService.init(mainWindow, store);
        historyService.init(mainWindow);
        downloadService.init(mainWindow);
        localService.init(mainWindow);
        authService.init(mainWindow, store);
        cloudService.init(mainWindow, store);
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
    registerEvents(store);
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

app.on('before-quit', async (e) => {
    MainWindow.setQuitFlag(true);
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

app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

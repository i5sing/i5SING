import { BrowserWindow } from "electron";
import { initTouchBar } from "../touch-bar";
import { initTray } from "../tray";
import { initAppMenu } from "../menu";

export class MainWindow {
    private static instance: BrowserWindow;

    private constructor() {
    }

    public static create() {
        return this.instance = this.createWindow();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = this.createWindow();
        } else {
            return this.instance;
        }
    }

    public static isInitialized() {
        return !!this.instance;
    }

    private static createWindow(): BrowserWindow {
        // Create the browser window.
        const mainWindow = new BrowserWindow({
            width: 1000,
            height: 670,
            minHeight: 670,
            maxHeight: 670,
            minWidth: 1000,
            maxWidth: 1000,
            center: true,
            titleBarStyle: 'hiddenInset',
            webPreferences: {
                webSecurity: false,
                preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            }
        });

        // and load the index.html of the app.
        mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

        // Open the DevTools.
        // mainWindow.webContents.openDevTools();

        // mainWindow.webContents.clearHistory();
        // mainWindow.webContents.on('did-finish-load', () => {
        //     mainWindow.webContents.clearHistory();
        // });

        // Emitted when the window is closed.
        mainWindow.on('closed', () => {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            this.instance = null;
        });

        mainWindow.on('close', e => {
            if (mainWindow.webContents.isFocused() && mainWindow.isVisible()) {
                e.preventDefault();
                mainWindow.hide();
            }
        });

        initTouchBar(mainWindow);
        initTray(mainWindow);
        initAppMenu(mainWindow);

        return mainWindow;
    }
}

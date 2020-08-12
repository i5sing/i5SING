import { BrowserWindow, Tray, TouchBar } from "electron";
import { initTouchBar } from "../touch-bar";
import { initTray } from "../trays/tray";
import { initAppMenu } from "../menu";
import { registerShortcut } from "../global-shortcut";
import { LoginWindow } from "./login.window";
import { initLrcTray } from "../trays/lrc-tray";

export class MainWindow {
    private static instance: BrowserWindow;
    private static tray: Tray;
    private static touchBar: TouchBar;
    private static lrcTray: Tray;
    private static willQuit: boolean = false;

    private constructor() {
    }

    public static getTray() {
        return this.tray;
    }

    public static getTouchBar() {
        return this.touchBar;
    }

    public static getLrcTray() {
        return this.lrcTray;
    }

    public static create(): MainWindow {
        return this.instance = this.createWindow();
    }

    public static setQuitFlag(willQuit: boolean) {
        this.willQuit = willQuit;
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
            show: false,
            resizable: false,
            fullscreen: false,
            transparent: process.platform === 'darwin',
            vibrancy: 'light',
            backgroundColor: process.platform === 'darwin' ? '#00FFFFFF' : '#FFFFFF',
            titleBarStyle: 'hiddenInset',
            webPreferences: {
                webSecurity: false,
                nodeIntegration: true,
                preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            }
        });

        // and load the index.html of the app.
        mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

        // Open the DevTools.
        // mainWindow.webContents.openDevTools();

        // Emitted when the window is closed.
        mainWindow.on('closed', () => this.instance = null);
        mainWindow.once('ready-to-show', () => mainWindow.show());
        mainWindow.on('close', e => {
            if (!this.willQuit) {
                e.preventDefault();
                mainWindow.hide();
                if (LoginWindow.getInstance()) {
                    LoginWindow.close();
                }
            }
        });

        this.touchBar = initTouchBar(mainWindow);
        this.tray = initTray(mainWindow);
        this.lrcTray = initLrcTray(mainWindow);
        registerShortcut(mainWindow);
        initAppMenu(mainWindow);

        return mainWindow;
    }
}

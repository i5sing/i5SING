import { BrowserWindow } from "electron";

export class LoginWindow {
    private static instance: BrowserWindow;

    private constructor() {
    }

    public static create(parent: BrowserWindow) {
        return this.instance = this.createWindow(parent);
    }

    public static getInstance() {
        return this.instance;
    }

    public static isInitialized() {
        return !!this.instance;
    }

    public static close() {
        this.instance.close();
        this.instance = null;
    }

    private static createWindow(parent: BrowserWindow): BrowserWindow {
        // Create the browser window.
        const mainWindow = new BrowserWindow({
            frame: false,
            resizable: false,
            height: 320,
            width: 300,
            center: true,
            alwaysOnTop: true,
            titleBarStyle: 'hiddenInset',
            parent: parent,
            maximizable: false,
            minimizable: false,
            fullscreenable: false,
            simpleFullscreen: false,
            webPreferences: {
                webSecurity: false,
                nodeIntegration: true,
                preload: LOGIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            }
        });

        // and load the index.html of the app.
        mainWindow.loadURL(LOGIN_WINDOW_WEBPACK_ENTRY);

        // Open the DevTools.
        // mainWindow.webContents.openDevTools();

        // Emitted when the window is closed.
        mainWindow.on('closed', () => {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            this.instance = null;
        });

        return mainWindow;
    }
}

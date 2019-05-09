import { Injectable } from "@nestjs/common";
import { ipcMain, BrowserWindow, App } from 'electron';
import { GO_BACK_EVENT, GO_FORWARD_EVENT } from "../../constants/Events";
import { INestService } from "./INestService";

@Injectable()
export class HistoryService implements INestService {
    public init(app: App, window: BrowserWindow) {
        ipcMain.on(GO_BACK_EVENT, () => {
            if (window.webContents.canGoBack()) {
                window.webContents.goBack();
            }
        });
        ipcMain.on(GO_FORWARD_EVENT, () => {
            if (window.webContents.canGoForward()) {
                window.webContents.goForward();
            }
        });
    }
}

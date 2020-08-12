import { Injectable } from "@nestjs/common";
import { ipcMain, BrowserWindow } from 'electron';
import { GO_BACK_EVENT, GO_FORWARD_EVENT } from "../../constants/events.constant";
import { INestService } from "../../interfaces";

@Injectable()
export class HistoryService implements INestService {
    private back(window: BrowserWindow) {
        if (window.webContents.canGoBack()) {
            window.webContents.goBack();
        }
    }

    private go(window: BrowserWindow) {
        if (window.webContents.canGoForward()) {
            window.webContents.goForward();
        }
    }

    public init(window: BrowserWindow) {
        ipcMain.on(GO_BACK_EVENT, () => this.back(window));
        ipcMain.on(GO_FORWARD_EVENT, () => this.go(window));
    }
}

import { Injectable } from "@nestjs/common";
import { get } from 'lodash';
import { ipcMain, BrowserWindow, app } from 'electron';
import { GET_SIGN_EVENT, INIT_SYSTEM_EVENT } from "../../constants/Events";
import { INestService } from "./INestService";
import { Store } from "../stores/Store";
import { IState } from "../../reducers";
import { REDUX_STORE } from "../../constants/Store";

@Injectable()
export class InitialService implements INestService {
    private readonly defaultSystem = {
        sign: '',
        userId: -1,
        nickname: '',
        homePath: '',
        canGoBack: false,
        canGoForward: false,
        avatar: '',
    };

    public init(mainWindow: BrowserWindow, store: Store) {
        ipcMain.on(GET_SIGN_EVENT, evt => {
            const state: IState = store.get(REDUX_STORE) || {} as any;
            evt.returnValue = get(state.system, 'sign');
        });
        ipcMain.on(INIT_SYSTEM_EVENT, evt => {
            const state: IState = store.get(REDUX_STORE) || {} as any;
            evt.returnValue = {
                ...this.defaultSystem,
                ...state.system,
                homePath: app.getPath('home'),
                canGoBack: mainWindow.webContents.canGoBack(),
                canGoForward: mainWindow.webContents.canGoForward(),
            }
        })
    }
}

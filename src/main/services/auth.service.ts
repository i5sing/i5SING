import { Injectable } from '@nestjs/common';
import { set } from 'lodash';
import { BrowserWindow } from 'electron';
import { createHash } from 'crypto';
import { I5singClient } from '../clients';
import { Store } from "../stores/store";
import { IState } from "../../reducers";
import { INestService } from "../../interfaces";
import { LoginWindow } from "../windows/login.window";
import { REDUX_STORE } from "../../constants/store.constant";
import { LOGIN_SUCCESS_EVENT } from "../../constants/events.constant";

@Injectable()
export class AuthService implements INestService {
    private readonly SIGN_KEY = '5SING_KUGOU';
    private store: Store;
    private window: BrowserWindow;

    constructor(
        private readonly client: I5singClient,
    ) {
    }

    init(window: BrowserWindow, store: Store): Promise<void> | void {
        this.store = store;
        this.window = window;
    }

    async login(username: string, password: string) {
        const md5 = createHash('md5');
        const sign = md5.update(`${username}${this.SIGN_KEY}${password}`).digest('hex');
        const response = await this.client.login(username, password, sign);
        const user = (await this.client.getUser(response.data.userid)).data;
        if (response.success) {
            LoginWindow.close();
            const state: IState = this.store.get(REDUX_STORE);
            set(state.system, 'sign', response.data.sign);
            set(state.system, 'userId', response.data.userid);
            set(state.system, 'nickname', user.NN);
            set(state.system, 'avatar', user.I);
            this.store.set(REDUX_STORE, state);
            this.store.sync();
            this.window.webContents.send(LOGIN_SUCCESS_EVENT, state.system);
        }

        return response;
    }

    async logout() {
        const state: IState = this.store.get(REDUX_STORE);
        set(state.system, 'sign', '');
        set(state.system, 'userId', '');
        set(state.system, 'nickname', '');
        set(state.system, 'avatar', '');
        this.store.set(REDUX_STORE, state);
        this.store.sync();
        this.window.webContents.send(LOGIN_SUCCESS_EVENT, state.system);
    }
}

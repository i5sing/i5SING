import { App, BrowserWindow } from 'electron';

export interface INestService {
    init(app: App, window: BrowserWindow, extra?: any): Promise<void> | void;
}

import { BrowserWindow } from 'electron';

export interface INestService {
    init(window: BrowserWindow, extra?: any): Promise<void> | void;
}

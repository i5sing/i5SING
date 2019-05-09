import { Injectable } from "@nestjs/common";
import * as moment from 'moment';
import { readdirSync, statSync, unlink } from 'fs';
import { resolve } from 'path';
import { handleFilename } from "../../utils/NameUtil";
import { IDownload } from "../../interfaces/IDownload";
import { INestService } from "./INestService";

@Injectable()
export class LocalService implements INestService {
    private home: string = '/Users/zhaofeng';

    init(app: Electron.App, window: Electron.BrowserWindow): Promise<void> | void {
        this.home = app.getPath('home');
    }

    public getLocalSongs(): IDownload[] {
        const downloadPath = resolve(this.home, 'i5sing/downloads');
        const files = readdirSync(downloadPath);
        const songs: IDownload[] = [];
        files.forEach(file => {
            const fileObj = handleFilename(file);
            if (fileObj) {
                const state = statSync(resolve(downloadPath, file));
                fileObj.createTime = moment(state.ctime).format('YYYY-MM-DD HH:mm:ss');
                fileObj.total = state.size;
                fileObj.received = state.size;
                fileObj.percent = 100;
                songs.push(fileObj);
            }
        });
        return songs;
    }

    public deleteLocalSong(filename: string) {
        const downloadPath = resolve(this.home, 'i5sing/downloads');
        unlink(resolve(downloadPath, filename), () => void 0);
    }
}

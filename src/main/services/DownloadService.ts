import { Injectable } from "@nestjs/common";
import { App, BrowserWindow, ipcMain } from 'electron';
import { resolve } from "path";
import { DOWNLOAD_SONG_END_EVENT, DOWNLOAD_SONG_EVENT } from "../../constants/Events";
import { INestService } from "./INestService";
import moment = require("moment");

@Injectable()
export class DownloadService implements INestService {
    private sender;

    init(app: App, window: BrowserWindow) {
        ipcMain.on(DOWNLOAD_SONG_EVENT, evt => {
            this.sender = evt.sender;
        });
        window.webContents.session.on('will-download', (event, item, webContents) => {
            const filename = decodeURIComponent(item.getFilename());
            const temp = filename.split(' - ');
            item.setSavePath(resolve(app.getPath('home'), 'i5sing/downloads', filename));

            item.on('updated', (event, state) => {
                if (state === 'interrupted') {
                    console.log('Download is interrupted but can be resumed')
                } else if (state === 'progressing') {
                    if (item.isPaused()) {
                        console.log('Download is paused')
                    } else {
                        console.log(`Received bytes: ${ item.getReceivedBytes() }, hello`);
                        if (this.sender)
                            this.sender.send(DOWNLOAD_SONG_EVENT, {
                                filename: filename,
                                songId: temp[3],
                                songKind: temp[2],
                                songName: temp[0],
                                userId: temp[4],
                                username: temp[1],
                                received: item.getReceivedBytes(),
                                total: item.getTotalBytes(),
                                percent: item.getReceivedBytes() / item.getTotalBytes() * 100,
                                createTime: moment().format('YYYY-MM-DD HH:mm')
                            })
                    }
                }
            });
            item.once('done', (event, state) => {
                if (state === 'completed') {
                    console.log('Download successfully')
                } else {
                    console.log(`Download failed: ${ state }`)
                }
                if (this.sender) {
                    this.sender.send(DOWNLOAD_SONG_END_EVENT)
                }
            })
        });
    }
}

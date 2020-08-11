import { Injectable } from "@nestjs/common";
import { app, BrowserWindow, ipcMain } from 'electron';
import { resolve } from "path";
import { DOWNLOAD_SONG_END_EVENT, DOWNLOAD_SONG_EVENT } from "../../constants/events.constant";
import moment = require("moment");
import { INestService } from "../../interfaces";

@Injectable()
export class DownloadService implements INestService {
    private sender;
    private readonly downloadPath = resolve(app.getPath('home'), 'i5sing/downloads');

    init(window: BrowserWindow) {
        ipcMain.on(DOWNLOAD_SONG_EVENT, evt => {
            this.sender = evt.sender;
        });
        window.webContents.session.on('will-download', (event, item, webContents) => {
            const filename = decodeURIComponent(item.getFilename());
            const temp = filename.split(' - ');
            const songId = temp[3];
            const songKind = temp[2];
            const songName = temp[0];
            const userId = temp[4];
            const username = temp[1];
            item.setSavePath(resolve(this.downloadPath, filename));

            item.on('updated', (event, state) => {
                if (state === 'interrupted') {
                    console.log('Download is interrupted but can be resumed')
                } else if (state === 'progressing') {
                    if (item.isPaused()) {
                        console.log('Download is paused')
                    } else {
                        console.log(`Received bytes: ${item.getReceivedBytes()}, hello`);
                        if (this.sender)
                            this.sender.send(DOWNLOAD_SONG_EVENT, {
                                filename,
                                songId,
                                songKind,
                                songName,
                                userId,
                                username,
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
                    console.log('Download successfully');
                } else {
                    console.log(`Download failed: ${state}`)
                }
                if (this.sender) {
                    this.sender.send(DOWNLOAD_SONG_END_EVENT)
                }
            })
        });
    }
}

import { ipcRenderer } from 'electron';
import { DOWNLOAD_SONG_END_EVENT } from "../constants/events.constant";

if (ipcRenderer) {
    ipcRenderer.on(DOWNLOAD_SONG_END_EVENT, () => {
        DownloadQueue.start();
    });
}

export class DownloadQueue {
    private static downloading: boolean = false;
    private static queue = [];

    public static downloads(songs: ({ songId: string, songType: string })[]) {
        this.queue = this.queue.concat(songs);
        if (!this.downloading) {
            this.start();
        }
    }

    public static download(songId: string, songType: string) {
        this.queue.push({ songId, songType });
        if (!this.downloading) {
            this.start();
        }
    }

    public static get() {
        return this.queue.shift();
    }

    public static start() {
        this.downloading = true;
        const song = DownloadQueue.get();
        if (song) {
            const a = document.createElement("a");
            const e = document.createEvent("MouseEvents");
            e.initEvent("click", false, false);
            a.href = `http://127.0.0.1:56562/songs/${song.songId}/download?songType=${song.songType}`;
            a.download = null;
            a.dispatchEvent(e);
        } else {
            this.downloading = false;
        }
    }
}

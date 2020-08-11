import { BrowserWindow, globalShortcut } from 'electron';
import { SONG_CHANGE_EVENT } from "../constants/events.constant";

export function registerShortcut(window: BrowserWindow) {
    globalShortcut.register('MediaPlayPause', () => {
        window.webContents.send(SONG_CHANGE_EVENT, 'play_pause');
    });
    globalShortcut.register('MediaPreviousTrack', () => {
        window.webContents.send(SONG_CHANGE_EVENT, 'pre');
    });
    globalShortcut.register('MediaNextTrack', () => {
        window.webContents.send(SONG_CHANGE_EVENT, 'next');
    });
}

import { IDownload } from "../interfaces/IDownload";

export function handleFilename(filename: string): IDownload {
    const chunks = filename.replace('.mp3', '').split(' - ');
    if (chunks.length === 5) {
        return {
            filename,
            songName: chunks[0],
            username: chunks[1],
            songKind: chunks[2],
            songId: chunks[3],
            userId: chunks[4],
        }
    }
}

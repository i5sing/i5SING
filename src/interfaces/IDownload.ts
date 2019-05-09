export interface IDownload {
    filename: string;
    songId: string;
    songName: string;
    songKind: string;
    userId: string;
    username: string;
    received?: number;
    total?: number;
    percent?: number;
    createTime?: string;
}

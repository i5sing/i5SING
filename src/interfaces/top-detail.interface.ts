import { IUser } from "./user.interface";

export interface ITopDetail {
    id: string;
    name: string;
    photo: string;
    songs: ITopSong[];
    count: number;
    photoBig: string;
    time: string;
    description?: string;
}

export interface ITopSong {
    id: string;
    songName: string;
    songKind: string;
    user: IUser;
    playTotal?: number;
}

import { I5singUser } from "./I5singUser";

export interface I5singTopDetail {
    id: string;
    name: string;
    photo: string;
    songs: I5singTopSong[];
    count: number;
    photoBig: string;
}

export interface I5singTopSong {
    ID: number;
    SN: string;
    SK: string;
    user: I5singUser;
}

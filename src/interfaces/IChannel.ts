import { IUser } from "./IUser";

export interface IChannel {
    picture: string;
    id: string;
    name: string;
    songName: string;
    time: string;
    words: string;
    playTime: string;
    type: string;
    click: number;
    url: string;
    user: IUser;
}

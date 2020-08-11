import { IUser } from "./user.interface";
import { ISong } from "./song.interface";

export interface IPlay {
    title: string;
    picture: string;
    description?: string;
    positionId?: string;
    id: string;
    playCount?: number;
    createTime?: string;
    user: IUser;
    hot?: number;
    label?: string;
    shares?: number;
    collects?: number;
    recommendTime?: number;
    songs?: ISong[];
    isLike?: boolean;
}

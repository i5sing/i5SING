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

export interface IMyPlay {
    C: string;
    CT: string;
    E: number;
    H: number;
    ID: string;
    P: string;
    T: string;
}

export interface IRecommendPlay {
    T: string;
    P: string;
    ID: string;
    H: string;
    user: {
        ID: string;
        NN: string;
        I: string;
    }
}

import { ISong } from "./song.interface";

export interface IUser {
    id: number;
    nickname: string;
    image?: string;
    description?: string;
    followers?: IUser[];
    birthday?: string;
    online?: boolean;
    follow?: boolean;
    sex?: 'male' | 'female';
    createTime?: string;
    province?: string;
    city?: string;
    isFollow?: boolean;
    yclist?: ISong[];
    fclist?: ISong[];
    bzlist?: ISong[];
}


export interface IFollower {
    ID: number;
    NN: string;
    I: string;
    B: string;
    M: string;
    online: number;
    follow: number;
    /**
     * 1 female
     */
    SX: number;
    CT: number;
}

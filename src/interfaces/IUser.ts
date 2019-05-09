import { ISong } from "./ISong";

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

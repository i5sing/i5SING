import { IUser } from "./IUser";
import { IMovieAddress } from "./IMovieAddress";

export interface IMovie {
    id: string;
    title: string;
    description: string;
    cover: string;
    fileExt: string;
    hash: string;
    size: number;
    bitRate: number;
    play: number;
    like: number;
    comment: number;
    collect: number;
    download: number;
    popularity: number;
    status: string;
    createTime: number;
    isLike: boolean;
    isCollect: boolean;
    songId: string;
    songType: string;
    user: IUser;
    addresses?: IMovieAddress[];
    movies?: IMovie[];
}

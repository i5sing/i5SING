import { IUser } from "./user.interface";

export interface IComment {
    id: string;
    content: string;
    repliesCount: number;
    createTime: string;
    like: number;
    isLike: boolean;
    user: IUser;
    replies?: IComment[];
    replyUser?: IUser;
}

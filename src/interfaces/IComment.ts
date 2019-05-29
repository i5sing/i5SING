import { IUser } from "./IUser";

export interface IComment {
    id: string;
    content: string;
    repliesCount: number;
    createTime: string;
    like: number;
    isLike: boolean;
    user: IUser;
    replies: IComment[];
    replyUser?: IUser;
}

import { I5singUser } from "./user.5sing.interface";

export interface I5singComment {
    id: string;
    content: string;
    userId: number;
    repliesCount: number;
    createTime: string;
    like: number;
    isLike: number;
    user: I5singUser;
    replyUser?: I5singUser;
    replys: I5singComment[];
}

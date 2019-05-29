import { I5singUser } from "./I5singUser";

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

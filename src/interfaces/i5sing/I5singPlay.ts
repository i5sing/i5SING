import { I5singUser } from "./I5singUser";

export interface I5singPlay {
    url: string;
    playcount: number;
    listId: string;
    listName: string;
    userId: string;
    userName: string;
    createTime: string;
    user: I5singUser;
}

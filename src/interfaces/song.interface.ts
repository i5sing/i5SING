import { IUser } from "./user.interface";

export interface ISong {
    id: string;
    name: string;
    kind: string;
    user: IUser;
    createTime?: number;

    local?: string;
    hqurl?: string;
    squrl?: string;
    lqurl?: string;
    dynamicWords?: string;
}

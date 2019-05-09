import { I5singUser } from "./I5singUser";

export interface I5singSong {
    ID: number;
    SN: string;
    UID: number;
    SK: string;
    SC: number;
    SCSR: number;
    ST: number;
    SS: number;
    KL: string;
    KL128: string;
    KLM: string;
    GD: number;
    DD: number;
    CT: number;
    user: I5singUser;
    dynamicWords: string;
    isFree: number;
    rank: number;
    sqsize: number;
    hqsize: number;
    lqsize: number;
    videoId: number;
    TmeIcon: number;
    albumId: number;
    albumName: string;
    songDelMsg: string;
}

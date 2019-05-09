import { I5singUser } from "./I5singUser";

export interface I5singPlayDetail {
    ID: string;
    CS: number;
    H: number;
    CT: number;
    T: string;
    C: string;
    P: string;
    E: string;
    S: number;
    user: I5singUser;
    L: string;
    SE: string;
    shares: string;
    collects: number;
    RecommandTime: number;
}

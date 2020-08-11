import { ISong } from "./song.interface";
import { IPlay } from "./play.interface";
import { IUser } from "./user.interface";

export interface ISearch {
    songs?: ISong[];
    plays?: IPlay[];
    users?: IUser[];
}

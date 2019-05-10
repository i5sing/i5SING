import { ISong } from "./ISong";
import { IPlay } from "./IPlay";
import { IUser } from "./IUser";

export interface ISearch {
    songs?: ISong[];
    plays?: IPlay[];
    users?: IUser[];
}

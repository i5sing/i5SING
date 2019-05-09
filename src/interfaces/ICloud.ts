import { ICloudSong } from "./ICloudSong";

export interface ICloud {
    accessKey: string;
    secretKey: string;
    bucket: string;
    zone: string;
    domain: string;
    songs?: ICloudSong[];
    loadings?: { [key: string]: boolean };
}

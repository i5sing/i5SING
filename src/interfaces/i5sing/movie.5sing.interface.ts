import { I5singUser } from "./user.5sing.interface";

export interface I5singMovie {
    id: string
    title: string;
    intro: string;
    source: string;
    kind: string;
    duration: string;
    cover_url: string;
    file_ext: string;
    hash: string;
    size: string;
    resolution_x: string;
    resolution_y: string;
    bitrate: string;
    play: string;
    like: string;
    comment: string;
    collect: string;
    download: string;
    popularity: string;
    status: string;
    user_id: string;
    song_type: string;
    song_id: string;
    create_time: number;
    share: string;
    type: string;
    allow_kick: string;
    isLike: number;
    isCollect: number;
    user: I5singUser;
}

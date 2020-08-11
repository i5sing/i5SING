export interface I5singSearch {
    songArray?: I5singSearchSong[];
    songMenu?: I5singSearchPlay[];
    user?: I5singSearchMusician[];
}

export interface I5singSearchSong {
    popularity: number;
    singer: string;
    singerId: number;
    songId: number;
    songName: string;
    type: number;
}

export interface I5singSearchMusician {
    nickName: string;
    url: string;
    popularity: number;
    userId: number;
    isMusician: number;
    Bigv: number;
}

export interface I5singSearchPlay {
    userId: number;
    url: string;
    playcount: number;
    listId: string;
    listName: string;
}

import { Controller, Delete, Get, Param } from "@nestjs/common";
import { LocalService } from "../services";

@Controller('/local')
export class LocalController {
    constructor(
        private readonly localService: LocalService,
    ) {
    }

    @Get('/songs')
    getLocalSongs() {
        const songs = this.localService.getLocalSongs();
        songs.sort((a, b) => a.createTime > b.createTime ? -1 : a.createTime < b.createTime ? 1 : 0);
        return songs;
    }

    @Delete('/songs/:filename')
    deleteLocalSong(@Param('filename') filename: string) {
        this.localService.deleteLocalSong(decodeURIComponent(filename));
    }
}

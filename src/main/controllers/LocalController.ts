import { Controller, Delete, Get, Param, Query, Res } from "@nestjs/common";
import { LocalService } from "../services";
import { createReadStream } from 'fs';

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

    @Get('/play')
    async playMusic(@Res() res, @Query('url') url: string) {
        const stream = createReadStream(decodeURIComponent(url));
        stream.pipe(res);
    }

    @Delete('/songs/:filename')
    deleteLocalSong(@Param('filename') filename: string) {
        this.localService.deleteLocalSong(decodeURIComponent(filename));
    }
}

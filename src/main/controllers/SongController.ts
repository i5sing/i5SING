import { Controller, Get, Param, Query, Res } from "@nestjs/common";
import * as request from 'request';
import { SongService } from "../services";

@Controller('')
export class SongController {
    constructor(
        private songService: SongService,
    ) {
    }

    @Get('/play-music')
    async playMusic(@Res() res, @Query('url') url: string) {
        const stream = request.get(decodeURIComponent(url), {
            headers: {
                'User-Agent': '5sing%E5%8E%9F%E5%88%9B%E9%9F%B3%E4%B9%90/6081002 CFNetwork/978.0.7 Darwin/18.5.0',
                'Accept-Encoding': 'gzip,deflate'
            }
        });
        stream.pipe(res);
    }

    @Get('/songs/:songId/download')
    async downloadMusic(@Res() res, @Param('songId') songId: string, @Query('songType') songType: string) {
        const { url, filename } = await this.songService.getSong(songId, songType);
        const stream = await this.songService.getSongStreamByUrl(url.hqurl || url.squrl || url.lqurl);
        res.setHeader('Content-Disposition', `attachment;filename=${ encodeURIComponent(filename) }`);
        stream.pipe(res);
    }
}

import { Controller, Get, Param, Query, Res } from "@nestjs/common";
import * as request from 'request';

@Controller('/movies')
export class MovieController {
    @Get('/:movieId/play')
    async playMovie(@Res() res, @Param('movieId') movieId: number, @Query('sign') sign: string) {
        const movieAddress = `http://mobileapi.5sing.kugou.com/mv/play?mvId=${ movieId }&type=1&level=1&sign=${ sign }`;
        const stream = request.get(movieAddress, {
            headers: {
                'User-Agent': '5sing%E5%8E%9F%E5%88%9B%E9%9F%B3%E4%B9%90/6081002 CFNetwork/978.0.7 Darwin/18.5.0',
                'Accept-Encoding': 'gzip,deflate'
            }
        });
        stream.pipe(res);
    }
}

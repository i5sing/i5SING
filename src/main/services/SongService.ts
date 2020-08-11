import { Injectable } from "@nestjs/common";
import { I5singClient } from "../clients";
import * as request from "request";
import * as stream from "stream";

@Injectable()
export class SongService {
    constructor(
        private readonly client: I5singClient,
    ) {
    }

    public async getSong(songId: string, songType: string) {
        const url = (await this.client.getSongUrl(songId, songType)).data;
        const song = (await this.client.getSong(songId, songType)).data;
        const filename = `${song.SN} - ${song.user.NN} - ${song.SK} - ${song.ID} - ${song.user.ID}.mp3`;

        return { url, song, filename };
    }

    public async getSongStream(songId: string, songType: string): Promise<stream.Stream> {
        const { url } = await this.getSong(songId, songType);
        return this.getSongStreamByUrl(url.hqurl || url.squrl || url.lqurl);
    }

    public async getSongStreamByUrl(url: string): Promise<stream.Stream> {
        return request.get(url, {
            headers: {
                'User-Agent': '5sing%E5%8E%9F%E5%88%9B%E9%9F%B3%E4%B9%90/6081002 CFNetwork/978.0.7 Darwin/18.5.0',
                'Accept-Encoding': 'gzip,deflate'
            }
        });
    }
}

import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudService } from "../services";
import * as stream from "stream";

@Controller('/cloud')
export class CloudController {
    constructor(
        private readonly cloudService: CloudService,
    ) {
    }

    @Get('/songs')
    async listSongs(@Query('marker') marker: string, @Query('limit') limit: number) {
        const songs = (await this.cloudService.listCloudSongs(marker, limit)).items;
        songs.sort((a, b) => a.putTime > b.putTime ? -1 : a.putTime < b.putTime ? 1 : 0);
        return { items: songs };
    }

    @Post('/songs')
    @UseInterceptors(FileInterceptor('file'))
    async uploadSong(@UploadedFile() file) {
        if (file) {
            const bufferStream = new stream.PassThrough();
            bufferStream.end(file.buffer);
            await this.cloudService.uploadLocalSong(file.originalname, bufferStream);
        }

        return {};
    }

    @Put('/songs')
    async transformSong(@Body('songId') songId: string, @Body('songType') songType: string) {
        await this.cloudService.uploadSong(songId, songType);
        return {};
    }

    @Delete('/songs/:songName')
    async delete(@Param('songName') songName: string) {
        const name = decodeURIComponent(songName);
        await this.cloudService.deleteSong(name);
        return {};
    }
}

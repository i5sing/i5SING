import { Injectable } from "@nestjs/common";
import { Get, Query, SetQuery } from '@nestcloud/feign';
import { I5singResponse } from "../../interfaces/i5sing/I5singResponse";
import { I5singSongUrl } from "../../interfaces/i5sing/I5singSongUrl";
import { I5singSong } from "../../interfaces/i5sing/I5singSong";
import { I5singUser } from "../../interfaces/i5sing/I5singUser";
import { version } from "../../constants/version";

@Injectable()
export class I5singClient {
    @Get('http://mobileapi.5sing.kugou.com/song/getSongUrl')
    @SetQuery('version', version)
    async getSongUrl(@Query('songid') songId: string, @Query('songtype') songType: string): Promise<I5singResponse<I5singSongUrl>> {
        return;
    }

    @Get('http://mobileapi.5sing.kugou.com/song/newget')
    @SetQuery('version', version)
    async getSong(@Query('songid') songId: string, @Query('songtype') songType: string): Promise<I5singResponse<I5singSong>> {
        return;
    }

    @Get('http://mobileapi.5sing.kugou.com/user/get')
    @SetQuery('apiVersion', '1')
    @SetQuery('fields', 'ID,NN,I,B,P,C,SX,E,M,VT,CT,TYC,TFC,TBZ,TFD,TFS,SC,YCRQ,FCRQ,CC,BG,DJ,RC,MC,AU,SR,SG,VG,ISC,F,OP,UBG,ISH')
    @SetQuery('version', version)
    async getUser(@Query('userid') userId: number): Promise<I5singResponse<I5singUser>> {
        return;
    }

    @Get('http://mobileapi.5sing.kugou.com/user/login')
    @SetQuery('version', version)
    async login(@Query('username') username: string, @Query('password') password: string, @Query('sign') sign: string): Promise<I5singResponse<{ userid: number, sign: string }>> {
        return;
    }
}

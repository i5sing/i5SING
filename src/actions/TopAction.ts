import { I5singResponse } from "../interfaces/i5sing/I5singResponse";
import { instance } from "../utils/HttpUtil";
import { AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { STYLE_TOP, STYLE_TOP_DETAIL, TOP, TOP_DETAIL } from "../constants/ActionTypes";
import { SET, UPDATE_PROPERTY } from "../constants/Actions";
import { ITop } from "../interfaces/ITop";
import { I5singTopDetail, I5singTopSong } from "../interfaces/i5sing/I5singTopDetail";
import { IState } from "../reducers";
import { I5singStyleTop } from "../interfaces/i5sing/I5singStyleTop";
import { I5singStyleTopSong } from "../interfaces/i5sing/I5singStyleTopSong";
import { ITopSong } from "../interfaces/ITopDetail";

const currentYear = new Date().getFullYear();

export class TopAction {

    public static getTops() {
        return async (dispatch: Dispatch) => {
            const url = 'http://mobileapi.5sing.kugou.com/rank/list';
            const query = {};
            const response: AxiosResponse<I5singResponse<ITop[]>> = await instance.get(
                url,
                { params: query }
            );
            const tops = response.data.data;
            dispatch({ type: TOP, action: SET, data: tops });
        }
    }

    public static getSupportSongs(page: number = 1, size: number = 99, time?: string) {
        return async (dispatch: Dispatch) => {
            if (!time) {
                time = await TopAction.getTopTime();
            }
            const url = 'http://mobileapi.5sing.kugou.com/songlist/hotsupportranklist';
            const query = { page, pageSize: size };
            const response: AxiosResponse<I5singResponse<I5singTopSong[]>> = await instance.get(
                url,
                { params: query }
            );
            const songs = response.data.data.map((song: I5singTopSong) => ({
                id: song.ID,
                songName: song.SN,
                songKind: song.SK,
                user: {
                    id: song.user.ID,
                    nickname: song.user.NN,
                    image: song.user.I
                }
            }));

            const detail = {
                id: 'list25',
                name: '支持榜',
                photo: 'http://static.5sing.kugou.com/app/images/all/rank/60750/hot_new.png',
                songs,
                time
            };
            dispatch({ type: TOP_DETAIL, action: SET, data: detail });
        }
    }

    public static getTopSongs(id: string, page: number = 1, size: number = 50, time?: string) {
        return async (dispatch: Dispatch, state: () => IState) => {
            if (!time) {
                time = await TopAction.getTopTime();
            }
            const url = 'http://mobileapi.5sing.kugou.com/rank/detail';
            const query = { id, time, pageindex: page, pagesize: size };
            const response: AxiosResponse<I5singResponse<I5singTopDetail>> = await instance.get(
                url,
                { params: query }
            );
            const item = response.data.data;
            let songs = (item.songs || []).map((song: I5singTopSong) => ({
                id: song.ID + '',
                songName: song.SN,
                songKind: song.SK,
                user: {
                    id: song.user.ID,
                    nickname: song.user.NN,
                    image: song.user.I
                }
            })) as ITopSong[];
            if (page === 1) {
                const detail = { ...item, songs, time };
                dispatch({ type: TOP_DETAIL, action: SET, data: detail });
            } else {
                const existSongs = state().top.songs;
                songs = existSongs.concat(songs);
                dispatch({ type: TOP_DETAIL, action: UPDATE_PROPERTY, path: 'songs', data: songs });
            }

            const count = page * size;
            const total = state().top.count;
            if (count < total) {
                this.getTopSongs(id, page + 1, size, time);
            }
        }
    }

    public static getStyleTops() {
        return async (dispatch: Dispatch) => {
            const url = 'http://mobileapi.5sing.kugou.com/song/getstyles';
            const query = {};
            const response: AxiosResponse<I5singResponse<I5singStyleTop[]>> = await instance.get(
                url,
                { params: query }
            );

            const tops = response.data.data.map((item: I5singStyleTop) => ({
                style: item.style,
                advertId: item.advert_id,
                rankImage: item.rankImage,
                white: item.white,
                white60750: item.white_60750,
                picture: item.pic,
            }));
            dispatch({ type: STYLE_TOP, action: SET, data: tops });
        }
    }

    public static getStyleTopSongs(style: string) {
        return async (dispatch: Dispatch, state: () => IState) => {
            const url = 'http://mobileapi.5sing.kugou.com/rank/stylerank';
            const query = { style };
            const response: AxiosResponse<I5singResponse<I5singStyleTopSong[]>> = await instance.get(
                url,
                { params: query }
            );

            let targetStyle = state().styleTops.filter(top => top.style === style)[0];
            if (!targetStyle) {
                dispatch(this.getStyleTops() as any);
            }
            targetStyle = state().styleTops.filter(top => top.style === style)[0];

            const songs = response.data.data.map((item: I5singStyleTopSong) => ({
                id: item.songId,
                songKind: item.songKind,
                songName: item.songName,
                user: {
                    id: item.userId,
                    nickname: item.nickname,
                    image: item.image,
                },
                playTotal: item.playTotal,
                description: (response.data as any).text,
            }));
            const detail = { id: style, name: style, photo: targetStyle.rankImage, count: songs.length, songs };
            dispatch({ type: STYLE_TOP_DETAIL, action: SET, data: detail });
        }
    }

    public static async getTopTime(): Promise<string> {
        const url = 'http://mobileapi.5sing.kugou.com/song/listsupportcardcycle';
        const query = {};
        const response: AxiosResponse<I5singResponse<{ [key: string]: string[] }>> = await instance.get(
            url,
            { params: query }
        );
        return response.data.data[currentYear][0];
    }
}


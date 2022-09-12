import { instance } from "../helpers";
import { AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { IState } from "../reducers";
import { I5singDiscoveryPlay, I5singPlay, I5singPlayDetail, I5singResponse, I5singSong } from "../interfaces/i5sing";
import { PLAY_LIST } from "../constants/network-status.constant";
import { NetworkAction } from "./network.action";
import { DISCOVERY_PLAYLIST, LOVE, MY, NETWORK_STATUS, PLAY, PLAYS } from "../constants/action-types.constant";
import { SET, UPDATE_PROPERTY } from "../constants/actions.constant";
import { IPlay } from "../interfaces";

export class PlayAction {
    public static getPlay(id: string) {
        return async (dispatch: Dispatch, state: () => IState) => {
            const url = 'http://mobileapi.5sing.kugou.com/song/getsonglist';
            const query = { id };
            const response: AxiosResponse<I5singResponse<I5singPlayDetail>> = await instance.get(url,
                { params: query }
            );
            const data = response.data.data;
            const existSongs = state().play.songs;
            const play = {
                id: data.ID,
                hot: data.H,
                createTime: data.CT,
                title: data.T,
                description: data.C,
                picture: data.P,
                user: {
                    id: data.user.ID,
                    nickname: data.user.NN,
                    image: data.user.I
                },
                label: data.L,
                shares: data.shares,
                collects: data.collects,
                recommendTime: data.RecommandTime,
                songs: existSongs,
            };

            dispatch({ type: PLAY, action: SET, data: play });
        }
    }

    public static getPlaySongs(id: string) {
        return async (dispatch: Dispatch) => {
            const url = 'http://mobileapi.5sing.kugou.com/song/getsonglistsong';
            const query = { id };
            const response: AxiosResponse<I5singResponse<I5singSong[]>> = await instance.get(url,
                { params: query }
            );
            const songs = response.data.data.map(song => ({
                id: song.ID,
                name: song.SN,
                kind: song.SK,
                user: {
                    id: song.user.ID,
                    nickname: song.user.NN,
                    image: song.user.I,
                }
            }));

            dispatch({ type: PLAY, action: UPDATE_PROPERTY, path: 'songs', data: songs });
        }
    }

    public static checkPlay(playId: string) {
        return async (dispatch: Dispatch) => {
            const url = 'http://mobileapi.5sing.kugou.com/song/songlistcollectioncheck';
            const query = { id: playId };
            const response: AxiosResponse<I5singResponse<any[]>> = await instance.get(url,
                { params: query }
            );

            dispatch({ type: PLAY, action: UPDATE_PROPERTY, path: 'isLike', data: response.data.success });
        }
    }

    public static likePlay(playId: string) {
        return async (dispatch: Dispatch) => {
            const url = 'http://mobileapi.5sing.kugou.com/song/songlistcollectionadd';
            const query = { id: playId };
            await instance.get(url, { params: query });

            dispatch({ type: PLAY, action: UPDATE_PROPERTY, path: 'isLike', data: true });
        }
    }

    public static dislikePlay(playId: string) {
        return async (dispatch: Dispatch) => {
            const url = 'http://mobileapi.5sing.kugou.com/song/songlistcollectiondelete';
            const query = { id: playId };
            await instance.get(url, { params: query });

            dispatch({ type: PLAY, action: UPDATE_PROPERTY, path: 'isLike', data: false });
        }
    }

    public static getLovePlays(page: number = 1, pageSize: number = 20) {
        return async (dispatch: Dispatch, state: () => IState) => {
            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${LOVE}_${UPDATE_PROPERTY}_plays`,
                data: { loading: true, nodata: false }
            });

            const url = 'http://mobileapi.5sing.kugou.com/song/songlistcollectionlist';
            const query = { pageindex: page, pagesize: pageSize };

            const response: AxiosResponse<I5singResponse<I5singPlayDetail[]>> = await instance.get(url,
                { params: query }
            );
            let plays = response.data.data.map((data: I5singPlayDetail) => ({
                id: data.ID,
                hot: data.H,
                createTime: data.CT + '',
                title: data.T,
                description: data.C,
                picture: data.P,
                user: {
                    id: data.user.ID,
                    nickname: data.user.NN,
                    image: data.user.I
                },
            })) as IPlay[];

            if (page !== 1) {
                const existPlays = state().love.plays;
                plays = existPlays.concat(plays);
            }

            dispatch({ type: LOVE, action: UPDATE_PROPERTY, path: 'plays', data: plays });

            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${LOVE}_${UPDATE_PROPERTY}_plays`,
                data: { loading: false, nodata: response.data.data.length === 0 }
            });
        }
    }
}

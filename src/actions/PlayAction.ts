import { I5singResponse } from "../interfaces/i5sing/I5singResponse";
import { instance } from "../utils/HttpUtil";
import { AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { DISCOVERY_PLAYLIST, LOVE, MY, NETWORK_STATUS, PLAY, PLAYS } from "../constants/ActionTypes";
import { SET, UPDATE_PROPERTY } from "../constants/Actions";
import { I5singDiscoveryPlay } from "../interfaces/i5sing/I5singDiscoveryPlay";
import { I5singPlay } from "../interfaces/i5sing/I5singPlay";
import { IState } from "../reducers";
import { I5singPlayDetail } from "../interfaces/i5sing/I5singPlayDetail";
import { I5singSong } from "../interfaces/i5sing/I5singSong";
import { IPlay } from "../interfaces/IPlay";

export class PlayAction {
    public static getRecommendPlayLists(index: number = 1) {
        return async (dispatch: Dispatch, state: () => IState) => {
            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${ PLAYS }_${ SET }`,
                data: { loading: true, nodata: false }
            });

            const url = 'http://mobileapi.5sing.kugou.com/go/GetSongListSquareRecommended';
            const query = { index };
            const response: AxiosResponse<I5singResponse<I5singDiscoveryPlay[]>> = await instance.get(
                url,
                { params: query }
            );
            const playlist = response.data.data.map(item => ({
                title: item.T,
                picture: item.P,
                id: item.ID,
                playCount: Number(item.H),
                user: {
                    id: item.user.ID,
                    nickname: item.user.NN,
                    image: item.user.I,
                }
            }));
            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${ PLAYS }_${ SET }`,
                data: { loading: false, nodata: response.data.data.length === 0 }
            });
            if (index === 1) {
                dispatch({ type: DISCOVERY_PLAYLIST, action: SET, data: playlist.slice(0, 10) });
            }

            const existPlays = index === 1 ? [] : state().plays;
            const data = existPlays.concat(playlist);
            dispatch({ type: PLAYS, action: SET, data });
        }
    }

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

    public static getPlaysByLabel(label: string, page: number, pageSize: number) {
        return async (dispatch: Dispatch, state: () => IState) => {
            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${ PLAYS }_${ SET }`,
                data: { loading: true, nodata: false }
            });

            const url = 'http://goapi.5sing.kugou.com/search/songSquare';
            const query = { sortType: 1, pn: page, ps: pageSize, label };
            const response: AxiosResponse<I5singResponse<I5singPlay[]>> = await instance.get(
                url,
                { params: query }
            );
            const playlist = response.data.data.map(item => ({
                playCount: item.playcount,
                title: item.listName,
                picture: item.url,
                id: item.listId,
                user: {
                    id: item.user.ID,
                    nickname: item.user.NN,
                    image: item.user.I,
                }
            }));
            dispatch({ type: PLAYS, action: SET, data: playlist });

            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${ PLAYS }_${ SET }`,
                data: { loading: false, nodata: response.data.data.length === 0 }
            });

            const existPlays = page === 1 ? [] : state().plays;
            const data = existPlays.concat(playlist);
            dispatch({ type: PLAYS, action: SET, data });
        }
    }

    public static getMyPlays() {
        return async (dispatch: Dispatch, state: () => IState) => {
            const userId = state().system.userId;
            const url = 'http://mobileapi.5sing.kugou.com/song/listsonglist';
            const query = { userid: userId, pageindex: 1, pagesize: 100000 };

            const response: AxiosResponse<I5singResponse<I5singPlayDetail[]>> = await instance.get(url,
                { params: query }
            );
            const plays = response.data.data.map((data: I5singPlayDetail) => ({
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
            }));

            dispatch({ type: MY, action: UPDATE_PROPERTY, path: 'plays', data: plays });
        }
    }

    public static getLovePlays(page: number = 1, pageSize: number = 20) {
        return async (dispatch: Dispatch, state: () => IState) => {
            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${ LOVE }_${ UPDATE_PROPERTY }_plays`,
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
                path: `${ LOVE }_${ UPDATE_PROPERTY }_plays`,
                data: { loading: false, nodata: response.data.data.length === 0 }
            });
        }
    }
}

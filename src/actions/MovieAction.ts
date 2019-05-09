import { I5singResponse } from "../interfaces/i5sing/I5singResponse";
import { instance } from "../utils/HttpUtil";
import { AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { DISCOVERY_MOVIE, LOVE, MOVIE, MOVIES, NETWORK_STATUS } from "../constants/ActionTypes";
import { SET, UPDATE_PROPERTY } from "../constants/Actions";
import { I5singMovie } from "../interfaces/i5sing/I5singMovie";
import { IState } from "../reducers";
import { IMovie } from "../interfaces/IMovie";
import { message } from "antd";

export class MovieAction {
    public static loveMovie(mvId: string) {
        return async (dispatch: Dispatch, state: () => IState) => {
            const url = 'http://mobileapi.5sing.kugou.com/mv/collectOperate';
            const query = { type: 3, mvId };
            const response = await instance.get<I5singResponse<any>>(
                url,
                { params: query }
            );

            if (!response.data.success) {
                return message.error(response.data.message)
            }

            dispatch({ type: MOVIE, action: UPDATE_PROPERTY, path: 'isCollect', data: true });
        }
    }

    public static disloveMovie(mvId: string) {
        return async (dispatch: Dispatch, state: () => IState) => {
            const url = 'http://mobileapi.5sing.kugou.com/mv/collectOperate';
            const query = { type: 2, mvId };
            const response = await instance.get<I5singResponse<any>>(
                url,
                { params: query }
            );

            if (!response.data.success) {
                return message.error(response.data.message)
            }

            dispatch({ type: MOVIE, action: UPDATE_PROPERTY, path: 'isCollect', data: false });
        }
    }

    public static likeMovie(mvId: string) {
        return async (dispatch: Dispatch, state: () => IState) => {
            const url = 'http://mobileapi.5sing.kugou.com/mv/LikeOpearate';
            const query = { type: 1, mvId };
            const response = await instance.get<I5singResponse<any>>(
                url,
                { params: query }
            );

            if (!response.data.success) {
                return message.error(response.data.message)
            }

            dispatch({ type: MOVIE, action: UPDATE_PROPERTY, path: 'isLike', data: true });
        }
    }

    public static dislikeMovie(mvId: string) {
        return async (dispatch: Dispatch, state: () => IState) => {
            const url = 'http://mobileapi.5sing.kugou.com/mv/LikeOpearate';
            const query = { type: 2, mvId };
            const response = await instance.get<I5singResponse<any>>(
                url,
                { params: query }
            );

            if (!response.data.success) {
                return message.error(response.data.message)
            }

            dispatch({ type: MOVIE, action: UPDATE_PROPERTY, path: 'isLike', data: false });
        }
    }

    public static getFavoriteMovies(page: number = 1) {
        return async (dispatch: Dispatch, state: () => IState) => {
            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${ LOVE }_${ UPDATE_PROPERTY }_movies`,
                data: { loading: true, nodata: false }
            });

            const url = 'http://mobileapi.5sing.kugou.com/mv/CollectList';
            const query = { page };

            const response: AxiosResponse<I5singResponse<I5singMovie[]>> = await instance.get(
                url,
                { params: query }
            );
            let movies = response.data.data.map(item => ({
                id: item.id,
                title: item.title,
                description: item.intro,
                cover: item.cover_url,
                songType: item.song_type,
                songId: item.song_id,
                fileExt: item.file_ext,
                hash: item.hash,
                size: Number(item.size),
                bitRate: Number(item.bitrate),
                play: Number(item.play),
                like: Number(item.like),
                comment: Number(item.comment),
                collect: Number(item.collect),
                download: Number(item.download),
                popularity: Number(item.popularity),
                status: item.status,
                createTime: item.create_time,
                isLike: item.isLike === 1,
                isCollect: item.isCollect === 1,
                user: {
                    id: item.user.ID,
                    nickname: item.user.NN,
                    image: item.user.I,
                },
                addresses: [],
            })) as IMovie[];

            if (page !== 1) {
                const existMovies = state().love.movies;
                movies = existMovies.concat(movies);
            }

            dispatch({ type: LOVE, action: UPDATE_PROPERTY, path: 'movies', data: movies });

            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${ LOVE }_${ UPDATE_PROPERTY }_movies`,
                data: { loading: false, nodata: response.data.data.length === 0 }
            });
        }
    }

    public static getMovies(pageIndex: number = 1, sortType: number = 3, userId?: number) {
        return async (dispatch: Dispatch, state: () => IState) => {
            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${ MOVIES }_${ SET }`,
                data: { loading: true, nodata: false }
            });
            const url = 'http://mobileapi.5sing.kugou.com/mv/list';
            const query = { sortType, from: 2, kind: 0, where: 1, pageIndex, userid: userId };
            const response: AxiosResponse<I5singResponse<{ list: I5singMovie[] }>> = await instance.get(
                url,
                { params: query }
            );
            const movies = response.data.data.list.map(item => ({
                id: item.id,
                title: item.title,
                description: item.intro,
                cover: item.cover_url,
                songType: item.song_type,
                songId: item.song_id,
                fileExt: item.file_ext,
                hash: item.hash,
                size: Number(item.size),
                bitRate: Number(item.bitrate),
                play: Number(item.play),
                like: Number(item.like),
                comment: Number(item.comment),
                collect: Number(item.collect),
                download: Number(item.download),
                popularity: Number(item.popularity),
                status: item.status,
                createTime: item.create_time,
                isLike: item.isLike === 1,
                isCollect: item.isCollect === 1,
                user: {
                    id: item.user.ID,
                    nickname: item.user.NN,
                    image: item.user.I,
                },
                addresses: [],
            }));

            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${ MOVIES }_${ SET }`,
                data: { loading: false, nodata: response.data.data.list.length === 0 }
            });

            if (userId) {
                return dispatch({ type: MOVIE, action: UPDATE_PROPERTY, path: 'movies', data: movies.slice(0, 3) });
            }

            if (pageIndex === 1 && sortType === 3) {
                dispatch({ type: DISCOVERY_MOVIE, action: SET, data: movies.slice(0, 4) });
            }

            const existMovies = pageIndex === 1 ? [] : state().movies;
            const data = existMovies.concat(movies);
            dispatch({ type: MOVIES, action: SET, data });
        }
    }

    public static getMovie(mvId) {
        return async (dispatch: Dispatch, state: () => IState) => {
            const url = 'http://mobileapi.5sing.kugou.com/mv/detail';
            const query = { mvId };
            const response: AxiosResponse<I5singResponse<I5singMovie>> = await instance.get(
                url,
                { params: query }
            );

            const existMovie = state().movie;
            const item = response.data.data;
            const movie = {
                id: item.id,
                title: item.title,
                description: item.intro,
                cover: item.cover_url,
                songType: item.song_type,
                songId: item.song_id,
                fileExt: item.file_ext,
                hash: item.hash,
                size: Number(item.size),
                bitRate: Number(item.bitrate),
                play: Number(item.play),
                like: Number(item.like),
                comment: Number(item.comment),
                collect: Number(item.collect),
                download: Number(item.download),
                popularity: Number(item.popularity),
                status: item.status,
                createTime: item.create_time,
                isLike: item.isLike === 1,
                isCollect: item.isCollect === 1,
                user: {
                    id: item.user.ID,
                    nickname: item.user.NN,
                    image: item.user.I,
                },
                addresses: [],
                movies: existMovie.movies,
            };
            dispatch({ type: MOVIE, action: SET, data: movie });
        }
    }
}

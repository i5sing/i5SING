import { I5singResponse } from "../interfaces/i5sing/I5singResponse";
import { instance } from "../utils/HttpUtil";
import { AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { get } from 'lodash';
import {
    CLOUD,
    DISCOVERY_LATEST_SONGS,
    DOWNLOAD,
    LOVE,
    MUSICIAN,
    NETWORK_STATUS,
} from "../constants/ActionTypes";
import { DELETE_BY_ID, SET, UNSHIFT, UPDATE_PROPERTY } from "../constants/Actions";
import { I5singLatestSong } from "../interfaces/i5sing/I5singLatestSong";
import { IDownload } from "../interfaces/IDownload";
import { IState } from "../reducers";
import { ISong } from "../interfaces/ISong";
import { I5singLoveSong } from "../interfaces/i5sing/I5singLoveSong";
import { I5singSong } from "../interfaces/i5sing/I5singSong";
import { I5singMusicBoxSong } from "../interfaces/i5sing/I5singMusicBoxSong";
import { CloudAction } from "./CloudAction";
import { message } from "antd";

export class SongAction {
    public static async getSong(songId: string, songType: string): Promise<ISong> {
        const url = 'http://mobileapi.5sing.kugou.com/song/newget';
        const query = { isfirst: 2, songtype: songType, songid: songId };
        const response: AxiosResponse<I5singResponse<I5singSong>> = await instance.get(
            url,
            { params: query }
        );

        const data = response.data.data;
        return {
            id: data.ID + '',
            name: data.SN,
            kind: data.SK,
            user: {
                id: data.user.ID,
                nickname: data.user.NN,
                image: data.user.I
            }
        };
    }

    public static getLatestSongs() {
        return async (dispatch: Dispatch) => {
            const url = 'http://mobileapi.5sing.kugou.com/songlist/first';
            const query = { isfirst: 2 };
            const response: AxiosResponse<I5singResponse<I5singLatestSong[]>> = await instance.get(
                url,
                { params: query }
            );
            const songs = response.data.data.map(item => ({
                name: item.songName,
                id: item.singId,
                type: item.singType,
                singerName: item.singer,
                singerId: item.singerId,
                image: item.image,
            }));
            dispatch({ type: DISCOVERY_LATEST_SONGS, action: SET, data: songs.slice(0, 10) });
        }
    }

    public static getLocalSongs() {
        return async (dispatch: Dispatch) => {
            const url = 'http://127.0.0.1:56562/local/songs';
            const query = {};
            const response: AxiosResponse<IDownload[]> = await instance.get(
                url,
                { params: query }
            );
            const songs = response.data;
            const downloads = {};
            songs.forEach(song => downloads[`${ song.songKind }-${ song.songId }`] = song);
            dispatch({ type: DOWNLOAD, action: SET, data: downloads });
        }
    }

    public static downloadSong(songId: number, songType: string) {
        return async (dispatch: Dispatch) => {
            const path = `${ songType }-${ songId }`;
            const data = { percent: 0, received: 0, total: 1, songId, songKind: songType };
            dispatch({ type: DOWNLOAD, action: UPDATE_PROPERTY, path, data });

            location.href = `http://127.0.0.1:56562/songs/${ songId }/download?songType=${ songType }`;
        }
    }

    public static downloadSongs(songs: ({ songId: number, songType: string })[]) {
        return async (dispatch: Dispatch) => {
            console.log(songs);
            songs.forEach(song => {
                setTimeout(() => {
                    const a = document.createElement("a");
                    const e = document.createEvent("MouseEvents");
                    e.initEvent("click", false, false);
                    a.href = `http://127.0.0.1:56562/songs/${ song.songId }/download?songType=${ song.songType }`;
                    a.download = null;
                    a.dispatchEvent(e);
                }, 0);
            });
        }
    }

    public static getLoveSongsStatus() {
        return async (dispatch: Dispatch, state: () => IState) => {
            const userId = state().system.userId;
            let url = 'http://mobileapi.5sing.kugou.com/song/GetStatusOfSongCollection';
            let query: any = { userId };
            let response: AxiosResponse<I5singResponse<{ count: string, lastModifyTime: string }>> = await instance.get(
                url,
                { params: query }
            );

            const status = response.data.data;
            const lastModified = Number(status.lastModifyTime);
            const count = Number(status.count);
            const exist = state().love;
            if (exist.lastModified !== lastModified || exist.count !== count) {
                const songs = await SongAction.getLoveSongs(userId);
                let image = '';
                if (songs.length) {
                    image = await SongAction.getSongImage(songs[0].id, songs[0].kind);
                }
                dispatch({
                    type: LOVE,
                    action: SET,
                    data: { lastModified, count, songs, image, plays: [], movies: [], musicians: [] }
                });
            }
        }
    }

    public static async getSongImage(songId: string, songType: string) {
        const url = 'http://mobileapi.5sing.kugou.com/song/newget';
        const query = { songid: songId, songtype: songType };
        const response: AxiosResponse<I5singResponse<I5singSong>> = await instance.get(
            url,
            { params: query }
        );

        return get(response, 'data.data.user.I');
    }

    public static async getLoveSongs(userId): Promise<ISong[]> {
        const url = 'http://mobileapi.5sing.kugou.com/song/collection';
        const query = { userid: userId, pageindex: 1, pagesize: 9223372036854775807 };
        const response: AxiosResponse<I5singResponse<I5singLoveSong[]>> = await instance.get(
            url,
            { params: query }
        );

        return response.data.data.map(item => ({
            id: item.SongID + '',
            name: item.SongName,
            kind: item.SongType,
            user: {
                id: item.SongUserID,
                nickname: item.NickName,
                image: '',
            }
        }))
    }

    public static syncLoveSongs(add: I5singMusicBoxSong[] = [], del: I5singMusicBoxSong[] = []) {
        return async (dispatch: Dispatch, state: () => IState) => {
            const userId = state().system.userId;
            const url = 'http://mobileapi.5sing.kugou.com/go/postLocalMusicbox';
            add.forEach(song => {
                dispatch({
                    type: LOVE, action: UNSHIFT, path: 'songs', data: {
                        id: song.ID,
                        name: song.SN,
                        kind: song.SK,
                        user: {
                            id: song.SUID,
                            nickname: song.NN,
                            image: '',
                        }
                    }
                })
            });
            del.forEach(song => {
                dispatch({
                    type: LOVE, action: DELETE_BY_ID, path: 'songs', id: { id: song.ID, kind: song.SK }
                })
            });

            dispatch({ type: LOVE, action: UPDATE_PROPERTY, path: 'songs', data: [...state().love.songs] });
            const response = await instance.post<I5singResponse<any>>(url, {
                Uid: userId,
                DataAdd: add,
                DataDel: del,
            });
            if (!response.data.success) {
                dispatch({ type: LOVE, action: UPDATE_PROPERTY, path: 'songs', data: [] });
                return message.error(response.data.message);
            }
        }
    }

    public static deleteLocalSong(songId: string, songKind: string) {
        return async (dispatch: Dispatch, state: () => IState) => {
            const download: IDownload = state().downloads[`${ songKind }-${ songId }`];
            if (download) {
                const filename = download.filename;
                const url = 'http://127.0.0.1:56562/local/songs/' + encodeURIComponent(filename);
                await instance.delete(url);

                delete state().downloads[`${ songKind }-${ songId }`];

                dispatch({ type: DOWNLOAD, action: SET, data: { ...state().downloads } })
            }

        }
    }

    public static getUserSongs(userId: string, songKind: string, page = 1, size = 20) {
        return async (dispatch: Dispatch, state: () => IState) => {
            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${ MUSICIAN }_${ UPDATE_PROPERTY }_songs`,
                data: { loading: true, nodata: false }
            });

            let url = 'http://mobileapi.5sing.kugou.com/song/user';
            let query: any = { userid: userId, songtype: songKind, pageindex: page, pagesize: size };
            let response: AxiosResponse<I5singResponse<I5singSong[]>> = await instance.get(
                url,
                { params: query }
            );

            const songs: ISong[] = response.data.data.map((song: I5singSong) => ({
                id: song.ID + '',
                name: song.SN,
                createTime: song.CT,
                kind: song.SK,
                user: {
                    id: song.user.ID,
                    nickname: song.user.NN,
                    image: song.user.I
                }
            }));

            const existSongs =
                page === 1 ? [] : get(state().musician, `${ userId }.${ songKind }list`, []) as ISong[];

            dispatch({
                type: MUSICIAN,
                action: UPDATE_PROPERTY,
                path: `${ userId }.${ songKind }list`,
                data: existSongs.concat(songs),
            });

            dispatch({
                type: NETWORK_STATUS,
                action: UPDATE_PROPERTY,
                path: `${ MUSICIAN }_${ UPDATE_PROPERTY }_songs`,
                data: { loading: false, nodata: response.data.data.length === 0 }
            });
        }
    }

    public static uploadSong(formData: FormData) {
        return async dispatch => {
            await instance.post(`http://127.0.0.1:56562/cloud/songs`, formData, {});
            dispatch(CloudAction.getCloudSongs());
        }
    }

    public static transformSong(songId: string, songType: string) {
        return async (dispatch, state: () => IState) => {
            dispatch({
                type: CLOUD,
                action: UPDATE_PROPERTY,
                path: `loadings['${ `${ songType }-${ songId }` }']`,
                data: true
            });
            try {
                await instance.put(`http://127.0.0.1:56562/cloud/songs`, { songId, songType }, {
                    headers: { songId, songType },
                });
            } catch (e) {
                dispatch({
                    type: CLOUD,
                    action: UPDATE_PROPERTY,
                    path: `loadings['${ `${ songType }-${ songId }` }']`,
                    data: false
                });
                dispatch({
                    type: CLOUD,
                    action: UPDATE_PROPERTY,
                    path: `loadings`,
                    data: Object.create(state().cloud.loadings)
                });
                return message.error(e.response ? e.response.data.message : e.message);
            }


            dispatch(CloudAction.getCloudSongs(() => {
                dispatch({
                    type: CLOUD,
                    action: UPDATE_PROPERTY,
                    path: `loadings['${ `${ songType }-${ songId }` }']`,
                    data: false
                });
                dispatch({
                    type: CLOUD,
                    action: UPDATE_PROPERTY,
                    path: `loadings`,
                    data: Object.create(state().cloud.loadings)
                });
            }));

        }
    }
}

import { IState } from "../reducers";
import { Dispatch } from "redux";
import { message } from 'antd';
import { findIndex, get } from 'lodash';
import { AxiosResponse } from "axios";
import { I5singResponse } from "../interfaces/i5sing/I5singResponse";
import { instance } from "../utils/HttpUtil";
import { I5singSongUrl } from "../interfaces/i5sing/I5singSongUrl";
import { CURRENT } from "../constants/ActionTypes";
import { UPDATE_PROPERTY } from "../constants/Actions";
import { ISong } from "../interfaces/ISong";
import { SongAction } from "./SongAction";

export class CurrentAction {
    public static plays(songs: ISong[]) {
        return async (dispatch: Dispatch, state: () => IState) => {
            const songlist = [...songs];
            if (songlist.length === 0) {
                return;
            }
            const song = songlist.shift();
            dispatch({ type: CURRENT, action: UPDATE_PROPERTY, path: 'current', data: -1 });
            dispatch({ type: CURRENT, action: UPDATE_PROPERTY, path: 'list', data: [...songlist] });
            dispatch(CurrentAction.play(song.id, song.kind, song) as any);
        }
    }

    public static async getSongUrl(songId: string, songType: string): Promise<I5singSongUrl> {
        const url = 'http://mobileapi.5sing.kugou.com/song/getSongUrl';
        const query = { songid: songId, songtype: songType };
        const response: AxiosResponse<I5singResponse<I5singSongUrl>> = await instance.get(
            url,
            { params: query }
        );

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        return response.data.data;
    }

    public static play(songId: string, songType: string, song?: ISong) {
        return async (dispatch: Dispatch, state: () => IState) => {
            if (!song) {
                song = await SongAction.getSong(songId, songType);
            }
            let current = state().current.current;
            const playlist = state().current.list;
            const index = findIndex<ISong>(playlist, o => o.id + '' === songId + '' && o.kind === songType);
            let next = current + 1;
            if (index !== -1) {
                current = index;
                next = current;
                playlist.splice(current, 1, song);
            } else {
                playlist.splice(next, 0, song);
            }

            dispatch({ type: CURRENT, action: UPDATE_PROPERTY, path: 'current', data: next });
            dispatch({ type: CURRENT, action: UPDATE_PROPERTY, path: 'list', data: playlist });

            if (!get(song, 'user.image') && get(song, 'user.id') !== -1) {
                song = await SongAction.getSong(song.id, song.kind);
            }

            if (!song.local) {
                try {
                    const url = await CurrentAction.getSongUrl(songId, songType);

                    playlist.splice(next, 1, { ...song, ...url });
                    dispatch({ type: CURRENT, action: UPDATE_PROPERTY, path: 'list', data: [...playlist] });
                } catch (e) {
                    message.error(e.message);
                    let index = current;
                    if (index >= 0) {
                        index = -1;
                    }
                    dispatch({ type: CURRENT, action: UPDATE_PROPERTY, path: 'current', data: index - 1 })
                }
            }
        }
    }

    public static next(index?: number) {
        return async (dispatch: Dispatch, state: () => IState) => {
            const current = index !== void 0 ? index : state().current.current;
            const seq = state().current.sequence;
            const playlist = state().current.list;
            if (current === -1) {
                return;
            }

            dispatch({ type: CURRENT, action: UPDATE_PROPERTY, path: 'current', data: -1 });

            setTimeout(async () => {
                let next = current;
                if (seq === 'loop') {
                    dispatch({
                        type: CURRENT,
                        action: UPDATE_PROPERTY,
                        path: 'current',
                        data: next
                    });
                } else if (seq === 'random') {
                    next = parseInt(Math.random() * playlist.length + '');
                    dispatch({ type: CURRENT, action: UPDATE_PROPERTY, path: 'current', data: next });
                } else {
                    if (current < playlist.length - 1) {
                        next = current + 1;
                        dispatch({ type: CURRENT, action: UPDATE_PROPERTY, path: 'current', data: next });
                    } else {
                        next = -1;
                        dispatch({ type: CURRENT, action: UPDATE_PROPERTY, path: 'current', data: -1 });
                    }
                }

                if (next !== -1) {
                    let song: ISong = playlist[next];
                    if (!get(song, 'user.image') && get(song, 'user.id') !== -1) {
                        song = await SongAction.getSong(song.id, song.kind);
                    }
                    if (song && !song.hqurl && !song.lqurl && !song.squrl && !song.local) {
                        try {
                            const url = await CurrentAction.getSongUrl(song.id, song.kind);

                            playlist.splice(next, 1, { ...song, ...url });
                            dispatch({ type: CURRENT, action: UPDATE_PROPERTY, path: 'list', data: [...playlist] });
                        } catch (e) {
                            message.error(e.message);
                            dispatch(CurrentAction.next() as any);
                        }
                    }
                }

            }, 0);
        }
    }

    public static previous() {
        return async (dispatch: Dispatch, state: () => IState) => {
            const current = state().current.current;
            const seq = state().current.sequence;
            const playlist = state().current.list;
            if (current === -1) {
                return;
            }

            dispatch({ type: CURRENT, action: UPDATE_PROPERTY, path: 'current', data: -1 });

            setTimeout(async () => {
                let next = current;
                if (seq === 'loop') {
                    dispatch({
                        type: CURRENT,
                        action: UPDATE_PROPERTY,
                        path: 'current',
                        data: next,
                    })
                } else if (seq === 'random') {
                    next = parseInt(Math.random() * playlist.length + '');
                    dispatch({ type: CURRENT, action: UPDATE_PROPERTY, path: 'current', data: next });
                } else {
                    next = -1;
                    dispatch({ type: CURRENT, action: UPDATE_PROPERTY, path: 'current', data: current - 1 });
                }

                if (next !== -1) {
                    let song: ISong = playlist[next];
                    if (!get(song, 'user.image') && get(song, 'user.id') !== -1) {
                        song = await SongAction.getSong(song.id, song.kind);
                    }
                    if (song && !song.hqurl && !song.lqurl && !song.squrl && !song.local) {
                        try {
                            const url = await CurrentAction.getSongUrl(song.id, song.kind);

                            playlist.splice(next, 1, { ...song, ...url });
                            dispatch({ type: CURRENT, action: UPDATE_PROPERTY, path: 'list', data: [...playlist] });
                        } catch (e) {
                            message.error(e.message);
                            dispatch(CurrentAction.next() as any);
                        }
                    }
                }
            }, 0);
        }
    }

    public static clear() {
        return dispatch => {
            dispatch({ type: CURRENT, action: UPDATE_PROPERTY, path: 'list', data: [] });
            dispatch({ type: CURRENT, action: UPDATE_PROPERTY, path: 'current', data: -1 });
        }
    }

    public static nextSequence() {
        return (dispatch, state: () => IState) => {
            const list = ['sequence', 'loop', 'random'];
            let currentSeq = state().current.sequence || 'sequence';
            let index = list.indexOf(currentSeq);
            if (index === -1) {
                index = -1;
            } else if (index === 2) {
                index = -1;
            }

            currentSeq = list[index + 1];
            dispatch({ type: CURRENT, action: UPDATE_PROPERTY, path: 'sequence', data: currentSeq });
        }
    }

    public static end() {
        return dispatch => dispatch({ type: CURRENT, action: UPDATE_PROPERTY, path: 'current', data: -1 });
    }
}

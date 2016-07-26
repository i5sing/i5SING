/**
 * Common Action
 * Created by zhaofeng on 7/12/16.
 */
import ACTIONS from '../constants/actions';
import SingSdk from '../backend/sing.sdk';
import db from '../backend/db/song.db';

const {
    PLAY,
    PLAY2,
    CLEAR,
    ADD,
    PAUSE,
    RESUME,
    ACTION,
    GET_SONG_INFO,
    NEXT,
    PREVIOUS,
    CHANGE_PLAY_TYPE,
    SYNC_SONG
} = ACTIONS;

/**
 * 播放playlist中歌曲
 * @param current
 * @returns {{type, data: {current: number}}}
 */
export function play(current = 0) {
    return {
        type: PLAY2,
        data: {
            current: current
        }
    };
}

/**
 * 清空播放列表
 * 如果songId不为空只清空某一首歌曲
 * @param songId
 * @param index
 * @returns {function(*)}
 */
export function clear(songId, index) {
    return (dispatch) => {
        if (songId) {
            db.deleteSong(songId).then(() => {
                dispatch({
                    type: CLEAR, data: {
                        songId: songId,
                        current: index
                    }
                });
            });
        } else {
            db.deleteSongs().then(() => {
                dispatch({
                    type: CLEAR, data: {}
                });
            })
        }
    }
}

/**
 * 替换原来的播放列表并播放
 * @param songs
 * @param type
 * @param current
 * @returns {function(*)}
 */
export function playAll(songs, type, current = 0) {
    return (dispatch) => {
        db.insertSongs(type || 'playlist', songs).then(() => {
            dispatch({
                type: PLAY, data: {
                    songs: songs,
                    current: current
                }
            });
        });
    }
}

/**
 * 向播放列表中添加歌曲
 * @param song
 * @returns {function(*)}
 */
export function add(song) {
    return (dispatch) => {
        db.insertSong(song).then(result => {
            return db.readSongs('playlist');
        }).then(result => {
            dispatch({type: ADD, data: {songs: result.songs}});
        }, err => {
            console.log(err);
        })

    };
}

/**
 * 读取播放列表
 * @returns {function(*)}
 */
export function readPlayList() {
    return (dispatch) => {
        db.readSongs('playlist').then(result => {
            dispatch({type: ADD, data: {songs: result.songs}});
        }, err => {
            console.log(err);
        })

    };
}

/**
 * 暂停
 * @returns {{type}}
 */
export function pause() {
    return {
        type: PAUSE
    }
}

/**
 * 继续
 * @returns {{type}}
 */
export function resume() {
    return {
        type: RESUME
    }
}

/**
 * 执行action成功
 * @param status
 * @returns {{type, status: *}}
 */
export function succeed(status) {
    return {
        type: ACTION,
        status: status
    }
}

/**
 * 下一曲
 * @returns {{type}}
 */
export function next() {
    return {
        type: NEXT
    }
}

/**
 * 上一曲
 * @returns {{type}}
 */
export function previous() {
    return {
        type: PREVIOUS
    }
}

/**
 * 改变播放方式
 * @returns {{type}}
 */
export function changePlayType() {
    return {
        type: CHANGE_PLAY_TYPE
    }
}

/**
 * 获取歌曲详细信息,包括歌曲地址
 * @param songId
 * @param songType
 * @param sign
 * @returns {function(*=)}
 */
export function getSongInfo(songId, songType, sign) {
    return (dispatch) => {
        return SingSdk.getSongAddr({
            songId: songId,
            songType: songType
        }).then(result => {
            return SingSdk.getSong({
                songId: songId,
                songType: songType
            }).then(res => {
                return Object.assign(result.data, res.data);
            });
        }).then(data => {
            if (sign) {
                SingSdk.checkSong({
                    songId: songId,
                    songType: songType,
                    sign: sign
                }).then(result => {
                    Object.assign(data, result.data);
                    dispatch({type: GET_SONG_INFO, data: {data: data}});
                })
            } else {
                dispatch({type: GET_SONG_INFO, data: {data: data}});
            }
        })
    };
}

/**
 * 同步歌曲到收藏
 * @param userId
 * @param add
 * @param del
 * @returns {function(*)}
 */
export function syncMySongs(userId, add, del) {
    return dispatch => {
        return SingSdk.syncMySongs({
            userId: userId,
            add: add,
            del: del
        }).then(result => {
            dispatch({type: SYNC_SONG, data: result});
        })
    }
}
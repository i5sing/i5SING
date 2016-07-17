/**
 * Created by zhaofeng on 7/12/16.
 */
import ACTIONS from '../constants/actions';
import SingSdk from '../backend/sing.sdk';
import db from '../backend/db/song.db';

const {
    PLAY,
    ADD,
    PAUSE,
    RESUME,
    ACTION,
    GET_SONG_INFO,
    NEXT,
    PREVIOUS
} = ACTIONS;

export function play(type) {
    return (dispatch) => {
        db.readSongs(type || 'playlist').then(result => {
            dispatch({type: PLAY, data: {songs: result.songs, current: 0}});
        }, err => {

        });
    };
}

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

export function readPlayList() {
    return (dispatch) => {
        db.readSongs('playlist').then(result => {
            dispatch({type: ADD, data: {songs: result.songs}});
        }, err => {
            console.log(err);
        })

    };
}

export function pause() {
    return {
        type: PAUSE
    }
}

export function resume() {
    return {
        type: RESUME
    }
}

export function succeed(status) {
    return {
        type: ACTION,
        status: status
    }
}

export function next() {
    return {
        type: NEXT
    }
}

export function previous() {
    return {
        type: PREVIOUS
    }
}

export function getSongInfo(songId, songType) {
    return (dispatch) => {
        return SingSdk.getSongAddr({
            songId: songId,
            songType: songType
        }).then(result => {
            SingSdk.getSong({
                songId: songId,
                songType: songType
            }).then(res => {
                Object.assign(result.data, res.data);
                dispatch({type: GET_SONG_INFO, data: result});
            }, err => {

            });
        });
    };
}
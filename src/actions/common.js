/**
 * Created by zhaofeng on 7/12/16.
 */
import ACTIONS from '../constants/actions';
import SingSdk from '../backend/sing.sdk';
import db from '../backend/db/song.db';

const {
    PLAY,
    PAUSE,
    RESUME,
    ACTION
} = ACTIONS;

export function play(type) {
    return (dispatch) => {
        db.readSongs(type || 'playlist').then(result => {
            console.log(result);
            dispatch({type: PLAY, data: result.songs});
        }, err => {

        });
    };
}

export function playAll(songs, type) {
    return (dispatch) => {
        db.insertSongs(type || 'playlist', songs).then(() => {
            dispatch({type: PLAY, data: songs});
        });
    }
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

export function succeed() {
    return {
        type: ACTION
    }
}

export function getSongAddr(songId, songType) {
    return SingSdk.getSongAddr({
        songId: songId,
        songType: songType
    });
}
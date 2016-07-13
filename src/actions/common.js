/**
 * Created by zhaofeng on 7/12/16.
 */
import ACTIONS from '../constants/actions';
import SingSdk from '../backend/sing.sdk';
import db from '../backend/song.db';

const {
    PLAY,
    PAUSE,
    RESUME,
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

export function getSongAddr(songId, songType) {
    return SingSdk.getSongAddr({
        songId: songId,
        songType: songType
    });
}
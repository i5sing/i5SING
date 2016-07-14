/**
 * Created by zhaofeng on 7/13/16.
 */
import SingSdk from '../backend/sing.sdk';

import ACTIONS from '../constants/actions';

const {
    GET_USER,
    GET_USER_SONGS
} = ACTIONS;


export function getUserInfo(userId) {
    return (dispatch) => {
        SingSdk.getUserInfo({
            userId: userId
        }).then(result => {
            console.log(result);
            dispatch({type: GET_USER, data: result.data});
        }, err => {

        });
    };
}

export function getUserSongs(userId, songType, pageIndex, pageSize) {
    return (dispatch) => {
        SingSdk.getUserSongs({
            userId: userId,
            songType: songType,
            pageIndex: pageIndex,
            pageSize: pageSize
        }).then(result => {
            dispatch({type: GET_USER_SONGS, data: result.data});
        }, err => {

        });
    };
}
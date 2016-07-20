/**
 * Favorite Action 收藏
 * Created by zhaofeng on 7/16/16.
 */
import SingSdk from '../backend/sing.sdk';

import ACTIONS from '../constants/actions';

const {
    GET_MY_SONGS
} = ACTIONS;

/**
 * 获取收藏歌曲列表
 * @param userId
 * @returns {function(*)}
 */
export function getMySongs(userId) {
    return (dispatch) => {
        SingSdk.getMySongs({
            userId: userId
        }).then(result => {
            dispatch({type: GET_MY_SONGS, data: result.data});
        }, err => {
        });
    };
}
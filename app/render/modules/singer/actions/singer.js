/**
 * Singer Action 音乐人
 * Created by zhaofeng on 7/13/16.
 */
import ACTIONS from '../constants/type';
import SingSdk from '../../../../common/sdk';

const {
    GET_USER,
    GET_USER_SONGS,
    ADD_TO_MY_ATTENTION,
    REMOVE_FROM_MY_ATTENTION
} = ACTIONS;

/**
 * 获取音乐人信息
 * @param userId
 * @param sign
 * @returns {function(*)}
 */
export function getUserInfo(userId, sign) {
    return (dispatch) => {
        SingSdk.getUserInfo({
            userId: userId
        }).then(result => {
            return SingSdk.checkFollowUser({
                userId: userId,
                sign: sign
            }).then(function (res) {
                Object.assign(result.data, res.data);
                dispatch({type: GET_USER, data: result.data});
            }, () => {
                dispatch({type: GET_USER, data: result.data});
            });
        }, err => {

        });
    };
}

/**
 * 获取音乐人歌曲列表
 * @param userId
 * @param songType
 * @param pageIndex
 * @param pageSize
 * @returns {function(*)}
 */
export function getUserSongs(userId, songType, pageIndex, pageSize) {
    return (dispatch) => {
        SingSdk.getUserSongs({
            userId: userId,
            songType: songType,
            pageIndex: pageIndex,
            pageSize: pageSize
        }).then(result => {
            dispatch({type: GET_USER_SONGS, result: result});
        }, err => {

        });
    };
}

/**
 * 添加到我的关注
 * @param userId
 * @param sign
 * @returns {function(*)}
 */
export function addToMyAttention(userId, sign) {
    return (dispatch) => {
        SingSdk.addToMyAttention({
            userId: userId,
            sign: sign
        }).then(result => {
            dispatch({type: ADD_TO_MY_ATTENTION, result: result});
        }, err => {

        });
    };
}

/**
 * 从我的关注移除
 * @param userId
 * @param sign
 * @returns {function(*)}
 */
export function removeFromMyAttention(userId, sign) {
    return (dispatch) => {
        SingSdk.removeFromMyAttention({
            userId: userId,
            sign: sign
        }).then(result => {
            dispatch({type: REMOVE_FROM_MY_ATTENTION, result: result});
        }, err => {

        });
    };
}
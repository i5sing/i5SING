/**
 * Favorite Action 收藏
 * Created by zhaofeng on 7/16/16.
 */
import ACTIONS from '../constants/type';
import SingSdk from '../../../common/sdk';

const {
    GET_MY_SONGS,
    GET_MY_ATTENTION,
    GET_MY_FANS,
    GET_ATTENTION_COLLECTION
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

/**
 * 获取我的关注
 * @param userId
 * @param pageIndex
 * @param pageSize
 * @param isIncrement
 * @returns {function(*)}
 */
export function getUserCollections(userId, pageIndex, pageSize, isIncrement) {
    return (dispatch) => {
        SingSdk.getUserCollections({
            userId: userId,
            pageIndex: pageIndex,
            pageSize: pageSize
        }).then(result => {
            dispatch({type: GET_MY_ATTENTION, data: result.data, isIncrement});
        }, err => {
        });
    };
}

/**
 * 获取我的粉丝
 * @param userId
 * @param pageIndex
 * @param pageSize
 * @param isIncrement
 * @returns {function(*)}
 */
export function getUserFans(userId, pageIndex, pageSize, isIncrement) {
    return (dispatch) => {
        SingSdk.getUserFans({
            userId: userId,
            pageIndex: pageIndex,
            pageSize: pageSize
        }).then(result => {
            dispatch({type: GET_MY_FANS, data: result.data, isIncrement});
        }, err => {
        });
    };
}

/**
 * 获取收藏的歌单
 * @param sign
 * @param pageIndex
 * @param pageSize
 * @param isIncrement
 * @returns {function(*)}
 */
export function getMySongCollections(sign, pageIndex, pageSize, isIncrement) {
    return (dispatch) => {
        SingSdk.getMySongCollections({
            sign: sign,
            pageIndex: pageIndex,
            pageSize: pageSize
        }).then(result => {
            dispatch({type: GET_ATTENTION_COLLECTION, data: result.data, isIncrement});
        }, err => {
        });
    };
}
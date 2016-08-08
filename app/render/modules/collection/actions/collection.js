/**
 * Collection Action 歌单
 * Created by zhaofeng on 7/14/16.
 */
import ACTIONS from '../constants/type';
import SingSdk from '../../../../common/sdk';

const {
    GET_COLLECTIONS,
    GET_COLLECTION,
    GET_COLLECTION_SONG,
    ADD_TO_MY_COLLECTIONS,
    REMOVE_FROM_MY_COLLECTIONS
} = ACTIONS;

/**
 * 获取歌单列表
 * @param pageIndex
 * @param isIncrement
 * @returns {function(*)}
 */
export function getSongCollections(pageIndex, isIncrement) {
    return (dispatch) => {
        SingSdk.getSongCollections({
            pageIndex: pageIndex
        }).then(result => {
            let collections = result.data;
            return SingSdk.getSongCollections({
                pageIndex: pageIndex + 1
            }).then(res => {
                return collections.concat(res.data);
            });
        }).then(collections => {
            dispatch({type: GET_COLLECTIONS, data: collections, isIncrement});
        });
    };
}

/**
 * 获取歌单详情
 * @param collectionId
 * @param sign
 * @returns {function(*)}
 */
export function getSongCollection(collectionId, sign) {
    return (dispatch) => {
        SingSdk.getSongCollection({
            id: collectionId
        }).then(result => {
            return SingSdk.checkSongCollection({
                id: collectionId,
                sign: sign
            }).then(res => {
                Object.assign(result.data, {isAttention: res.success});
                dispatch({type: GET_COLLECTION, data: result.data});
            }, () => {
                dispatch({type: GET_COLLECTION, data: result.data});
            });
        }, err => {

        });
    };
}

/**
 * 获取歌单中歌曲列表
 * @param collectionId
 * @returns {function(*)}
 */
export function getSongsInSongCollections(collectionId) {
    return (dispatch) => {
        SingSdk.getSongsInSongCollections({
            id: collectionId
        }).then(result => {
            dispatch({type: GET_COLLECTION_SONG, data: result.data});
        }, err => {

        });
    };
}

/**
 * 添加歌单到我的收藏
 * @param collectionId
 * @param sign
 * @returns {function(*)}
 */
export function addToMyCollections(collectionId, sign) {
    return (dispatch) => {
        SingSdk.addToMyCollections({
            id: collectionId,
            sign: sign
        }).then(result => {
            dispatch({type: ADD_TO_MY_COLLECTIONS, result: result});
        }, err => {

        });
    };
}

/**
 * 从我的收藏中移除歌单
 * @param collectionId
 * @param sign
 * @returns {function(*)}
 */
export function removeFromMyCollections(collectionId, sign) {
    return (dispatch) => {
        SingSdk.removeFromMyCollections({
            id: collectionId,
            sign: sign
        }).then(result => {
            dispatch({type: REMOVE_FROM_MY_COLLECTIONS, result: result});
        }, err => {

        });
    };
}
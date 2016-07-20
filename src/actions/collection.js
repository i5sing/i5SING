/**
 * Collection Action 歌单
 * Created by zhaofeng on 7/14/16.
 */
import SingSdk from '../backend/sing.sdk';
import ACTIONS from '../constants/actions';

const {
    GET_COLLECTIONS,
    GET_COLLECTION,
    GET_COLLECTION_SONG
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
 * @returns {function(*)}
 */
export function getSongCollection(collectionId) {
    return (dispatch) => {
        SingSdk.getSongCollection({
            id: collectionId
        }).then(result => {
            dispatch({type: GET_COLLECTION, data: result.data});
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
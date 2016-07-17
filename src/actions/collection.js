/**
 * Created by zhaofeng on 7/14/16.
 */
import SingSdk from '../backend/sing.sdk';
import ACTIONS from '../constants/actions';

const {
    GET_COLLECTIONS,
    GET_COLLECTION,
    GET_COLLECTION_SONG
} = ACTIONS;

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
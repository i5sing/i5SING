/**
 * Created by zhaofeng on 7/12/16.
 */
import SingSdk from '../backend/sing.sdk';
import ACTIONS from '../constants/actions';

const {
    GET_ADVERTISEMENTS,
    GET_DAILY_RECOMMEND,
    GET_SPECIAL_COLUMN,
    GET_LATEST_SINGERS,
    GET_SINGERS,
    
    APPEARANCE_ERROR
} = ACTIONS;

export function getCarousel(advertId) {
    return (dispatch) => {
        SingSdk.getAdvertisements({
            advertId: advertId
        }).then(result => {
            dispatch({type: GET_ADVERTISEMENTS, data: result.data});
        }, err => {
            dispatch({type: APPEARANCE_ERROR, error: err});
        });
    };
}

export function getDailyRecommendSongs(pageIndex, pageSize) {
    return (dispatch) => {
        SingSdk.getDailyRecommendSongs({
            pageIndex: pageIndex,
            pageSize: pageSize
        }).then(result => {
            dispatch({type: GET_DAILY_RECOMMEND, data: result.data});
        }, err => {
            dispatch({type: APPEARANCE_ERROR, error: err});
        });
    };
}

export function getSpecialColumn() {
    return (dispatch) => {
        SingSdk.getSpecialColumn().then(result => {
            dispatch({type: GET_SPECIAL_COLUMN, data: result.data});
        }, err => {
            dispatch({type: APPEARANCE_ERROR, error: err});
        });
    };
}

export function getSingers(pageIndex, pageSize) {
    return (dispatch) => {
        SingSdk.getSingers({
            pageIndex: pageIndex,
            pageSize: pageSize
        }).then(result => {
            dispatch({type: GET_SINGERS, data: result.data});
        }, err => {
            dispatch({type: APPEARANCE_ERROR, error: err});
        });
    };
}

export function getLatestSingers(pageIndex, pageSize) {
    return (dispatch) => {
        SingSdk.getLatestSingers({
            pageIndex: pageIndex,
            pageSize: pageSize
        }).then(result => {
            dispatch({type: GET_LATEST_SINGERS, data: result.data});
        }, err => {
            dispatch({type: APPEARANCE_ERROR, error: err});
        });
    };
}
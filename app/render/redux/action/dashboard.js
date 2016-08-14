/**
 * Appearance Action 发现
 * Created by zhaofeng on 7/12/16.
 */
import ACTIONS from '../constants/type';
import SingSdk from '../../../common/sdk';

const {
    GET_ADVERTISEMENTS,
    GET_DAILY_RECOMMEND,
    GET_SPECIAL_COLUMN,
    GET_LATEST_SINGERS,
    GET_SINGERS,

    APPEARANCE_ERROR
} = ACTIONS;

/**
 * 获取轮播图列表
 * @param advertId
 * @returns {function(*)}
 */
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

/**
 * 获取每日推荐列表
 * @param pageIndex
 * @param pageSize
 * @returns {function(*)}
 */
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

/**
 * 获取专栏
 * @returns {function(*)}
 */
export function getSpecialColumn() {
    return (dispatch) => {
        SingSdk.getSpecialColumn().then(result => {
            dispatch({type: GET_SPECIAL_COLUMN, data: result.data});
        }, err => {
            dispatch({type: APPEARANCE_ERROR, error: err});
        });
    };
}

/**
 * 获取热门歌手
 * @param pageIndex
 * @param pageSize
 * @returns {function(*)}
 */
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

/**
 * 获取新入驻歌手
 * @param pageIndex
 * @param pageSize
 * @returns {function(*)}
 */
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
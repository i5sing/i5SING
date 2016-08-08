/**
 * Rank Action 排行榜
 * Created by zhaofeng on 7/12/16.
 */
import ACTIONS from '../constants/type';
import SingSdk from '../../../../common/sdk';

const {
    GET_RANK_OVERVIEW,
    GET_RANK_DETAIL,
    RANK_ERROR
} = ACTIONS;

const year = new Date().getFullYear();

/**
 * 获取排行榜种类
 * @returns {function(*)}
 */
export function getRankOverview() {
    return (dispatch) => {
        SingSdk.getRankOverview().then(result => {
            dispatch({type: GET_RANK_OVERVIEW, data: result.data});
        }, err => {
            dispatch({type: RANK_ERROR, error: err});
        });
    };
}

/**
 * 获取排行榜详情
 * @param rankId
 * @param pageIndex
 * @param pageSize
 * @returns {function(*)}
 */
export function getRankDetail(rankId, pageIndex, pageSize) {
    return (dispatch) => {
        let time = '';
        SingSdk.getRankUpdateList().then(result => {
            time = result.data[year][0];
            return SingSdk.getRankDetail({
                id: rankId,
                time: time,
                pageIndex: pageIndex,
                pageSize: pageSize
            });
        }).then(result => {
            result.data.time = time;
            dispatch({type: GET_RANK_DETAIL, data: result.data});
        }, err => {
            dispatch({type: RANK_ERROR, error: err});
        });
    };
}
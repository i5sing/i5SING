/**
 * Created by zhaofeng on 7/12/16.
 */
import SingSdk from '../backend/sing.sdk';

import ACTIONS from '../constants/actions';

const {
    GET_RANK_OVERVIEW,
    GET_RANK_DETAIL,
    RANK_ERROR
} = ACTIONS;

const year = new Date().getFullYear();

export function getRankOverview() {
    return (dispatch) => {
        SingSdk.getRankOverview().then(result => {
            dispatch({type: GET_RANK_OVERVIEW, data: result.data});
        }, err => {
            dispatch({type: RANK_ERROR, error: err});
        });
    };
}

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
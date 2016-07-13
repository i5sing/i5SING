/**
 * Created by zhaofeng on 7/12/16.
 */
import SingSdk from '../backend/sing.sdk';

import ACTIONS from '../constants/actions';

const {
    GET_RANK_OVERVIEW,
    RANK_ERROR
} = ACTIONS;

export function getRankOverview() {
    return (dispatch) => {
        SingSdk.getRankOverview().then(result => {
            dispatch({type: GET_RANK_OVERVIEW, data: result.data});
        }, err => {
            dispatch({type: RANK_ERROR, error: err});
        });
    };
}
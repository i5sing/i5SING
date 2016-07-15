/**
 * Created by zhaofeng on 7/15/16.
 */
import SingSdk from '../backend/sing.sdk';

import ACTIONS from '../constants/actions';

const {
    GET_SQUARE
} = ACTIONS;


export function getSquareList(pageIndex, pageSize, sign) {
    return (dispatch) => {
        SingSdk.getSquareList({
            pageIndex: pageIndex,
            pageSize: pageSize,
            sign: sign
        }).then(result => {
            console.log(result);
            dispatch({type: GET_SQUARE, data: result.data});
        }, err => {

        });
    };
}
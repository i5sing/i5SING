/**
 * Columns Action 专栏
 * Created by zhaofeng on 7/19/16.
 */
import ACTIONS from '../constants/type';
import SingSdk from '../../../utils/sdk';

const {
    GET_SPECIAL_COLUMNS
} = ACTIONS;

/**
 * 获取专栏列表
 * @param channelId
 * @param pageIndex
 * @param pageSize
 * @param isIncrement
 * @returns {function(*)}
 */
export function getSpecialColumnDetail(channelId, pageIndex, pageSize, isIncrement) {
    return (dispatch) => {
        SingSdk.getSpecialColumnDetail({
            channelId: channelId,
            pageIndex: pageIndex,
            pageSize: pageSize
        }).then(result => {
            dispatch({type: GET_SPECIAL_COLUMNS, data: result.data, isIncrement});
        }, err => {

        });
    };
}
/**
 * Search Action 搜索
 * Created by zhaofeng on 2016/7/24.
 */
import ACTIONS from '../constants/type';
import SingSdk from '../../../common/sdk';

const {
    SEARCH,
} = ACTIONS;

/**
 * 搜索
 * @param keyword
 * @param type
 * @param pageIndex
 * @param pageSize
 * @param isIncrement
 * @returns {function(*)}
 */
export function search(keyword, type, pageIndex, pageSize, isIncrement) {
    return (dispatch) => {
        SingSdk.search({
            keyword: keyword,
            type: type,
            pageIndex: pageIndex,
            pageSize: pageSize
        }).then(result => {
            dispatch({type: SEARCH, data: result.data, isIncrement, searchType: type});
        }, err => {

        });
    };
}
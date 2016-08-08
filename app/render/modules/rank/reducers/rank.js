/**
 * Created by zhaofeng on 7/12/16.
 */
import ACTIONS from '../constants/type';

const {
    GET_RANK_OVERVIEW,
    GET_RANK_DETAIL
} = ACTIONS;
export default (state = {}, action) => {
    switch (action.type) {
        case GET_RANK_OVERVIEW:
            state.overviews = action.data;
            break;
        case GET_RANK_DETAIL:
            state.rankDetail = action.data;
            break;
    }

    return Object.create(state);
}
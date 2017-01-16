/**
 * Created by zhaofeng on 7/12/16.
 */
import ACTIONS from '../constants/type';

const {
    GET_ADVERTISEMENTS,
    GET_DAILY_RECOMMEND,
    GET_SPECIAL_COLUMN,
    GET_LATEST_SINGERS,
    GET_RECOMMEND_COLLECTIONS,
    GET_SINGERS
} = ACTIONS;
export default (state = {}, action) => {
    switch (action.type) {
        case GET_ADVERTISEMENTS:
            state.carousels = action.data;
            break;
        case GET_DAILY_RECOMMEND:
            state.dailyRecommends = action.data.list;
            break;
        case GET_SPECIAL_COLUMN:
            state.specialColumns = action.data;
            break;
        case GET_LATEST_SINGERS:
            state.latestSingers = action.data;
            break;
        case GET_SINGERS:
            state.recommendSingers = action.data;
            break;
        case GET_RECOMMEND_COLLECTIONS:
            state.recommendCollections = action.data;
            break;
    }

    return Object.create(state);
}
/**
 * Created by zhaofeng on 7/12/16.
 */
import ACTIONS from '../constants/actions';

const {
    GET_RANK_OVERVIEW,
} = ACTIONS;
export default (state = {}, action) => {
    switch (action.type) {
        case GET_RANK_OVERVIEW:
            state.overviews = action.data;
            break;
    }

    return Object.create(state);
}
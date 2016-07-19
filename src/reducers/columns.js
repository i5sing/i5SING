/**
 * Created by zhaofeng on 7/19/16.
 */
import ACTIONS from '../constants/actions';

const {
    GET_SPECIAL_COLUMNS
} = ACTIONS;
export default (state = {}, action) => {
    switch (action.type) {
        case GET_SPECIAL_COLUMNS:
            if (action.isIncrement) {
                state.specialColumns = (state.specialColumns || []).concat(action.data);
            } else {
                state.specialColumns = action.data;
            }
            break;
    }

    return Object.create(state);
}
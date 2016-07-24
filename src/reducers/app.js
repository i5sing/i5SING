/**
 * Created by zhaofeng on 7/16/16.
 */
import ACTIONS from '../constants/actions';

const {
    GET_PERSONAL_INFO,
    LOGOUT
} = ACTIONS;

export default (state = {}, action) => {
    switch (action.type) {
        case GET_PERSONAL_INFO:
            state.info = action.data;
            break;
        case LOGOUT:
            state.info = {};
            break;
    }

    return Object.create(state);
}
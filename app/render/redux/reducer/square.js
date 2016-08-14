/**
 * Created by zhaofeng on 7/15/16.
 */
import ACTIONS from '../constants/type';

const {
    GET_SQUARE
} = ACTIONS;
export default (state = {}, action) => {
    switch (action.type) {
        case GET_SQUARE:
            state.squareList = action.data;
            break;
    }

    return Object.create(state);
}
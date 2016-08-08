/**
 * Created by zhaofeng on 7/13/16.
 */
import ACTIONS from '../constants/type';

const {
    GET_USER,
    GET_USER_SONGS,
    ADD_TO_MY_ATTENTION,
    REMOVE_FROM_MY_ATTENTION
} = ACTIONS;
export default (state = {}, action) => {
    switch (action.type) {
        case GET_USER:
            state.userInfo = action.data;
            break;
        case GET_USER_SONGS:
            state.userSongs = action.result.data;
            state.count = action.result.count;
            break;
        case ADD_TO_MY_ATTENTION:
            if (action.result.success)
                state.userInfo.follow = 1;
            break;
        case REMOVE_FROM_MY_ATTENTION:
            if (action.result.success)
                state.userInfo.follow = 0;
            break;
    }

    return Object.create(state);
}
/**
 * Created by zhaofeng on 7/13/16.
 */
import ACTIONS from '../constants/actions';

const {
    GET_USER,
    GET_USER_SONGS
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
    }

    return Object.create(state);
}
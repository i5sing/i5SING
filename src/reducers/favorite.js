/**
 * Created by zhaofeng on 7/16/16.
 */
import ACTIONS from '../constants/actions';

const {
    GET_MY_SONGS
} = ACTIONS;
export default (state = {}, action) => {
    switch (action.type) {
        case GET_MY_SONGS:
            state.songs = action.data;
            break;
    }

    return Object.create(state);
}
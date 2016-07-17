/**
 * Created by zhaofeng on 7/11/16.
 */
import ACTIONS from '../constants/actions';

const {
    PLAY,
    ADD,
    RESUME,
    PAUSE,
    ACTION,
    GET_PERSONAL_INFO
} = ACTIONS;

export default (state = {}, action) => {
    switch (action.type) {
        case PLAY:
            state.playlist = action.data.songs;
            state.playing = true;
            state.resume = false;
            state.success = false;
            state.current = action.data.current || 0;
            break;
        case ADD:
            state.playlist = action.data.songs;
            break;
        case RESUME:
            state.playing = true;
            state.resume = true;
            state.success = false;
            break;
        case PAUSE:
            state.playing = false;
            state.resume = false;
            state.success = false;
            break;
        case ACTION:
            state.success = true;
            break;
        case GET_PERSONAL_INFO:
            state.info = action.data;
            break;
    }

    return Object.create(state);
}
/**
 * Created by zhaofeng on 7/11/16.
 */
import ACTIONS from '../constants/actions';

const {
    PLAY,
    RESUME,
    PAUSE,
    ACTION
} = ACTIONS;

export default (state = {}, action) => {
    switch (action.type) {
        case PLAY:
            state.playlist = action.data;
            state.playing = true;
            state.resume = false;
            state.success = false;
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
    }

    return Object.create(state);
}
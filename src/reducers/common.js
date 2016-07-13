/**
 * Created by zhaofeng on 7/11/16.
 */
import ACTIONS from '../constants/actions';

const {
    PLAY,
    RESUME,
    PAUSE
} = ACTIONS;

export default (state = {}, action) => {
    console.log(action);
    switch (action.type) {
        case PLAY:
            state.playlist = action.data;
            state.playing = true;
            state.resume = false;
            break;
        case RESUME:
            state.playing = true;
            state.resume = true;
            break;
        case PAUSE:
            state.playing = false;
            state.resume = false;
            break;
    }

    return Object.create(state);
}
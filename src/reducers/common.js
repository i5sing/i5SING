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
    GET_PERSONAL_INFO,
    GET_SONG_INFO,
    NEXT,
    PREVIOUS
} = ACTIONS;

export default (state = {}, action) => {
    switch (action.type) {
        case PLAY:
            state.playlist = action.data.songs;
            state.current = action.data.current || 0;
            state.status = 1; //加载播放列表成功
            break;
        case ADD:
            state.playlist = action.data.songs;
            break;
        case NEXT:
            state.current = state.current + 1;
            state.status = 1; //加载播放列表成功
            break;
        case PREVIOUS:
            state.current = state.current - 1;
            state.status = 1; //加载播放列表成功
            break;
        case RESUME:
            state.status = 2; //继续
            break;
        case PAUSE:
            state.status = 3; //暂停
            break;
        case ACTION:
            state.status = action.status || 0; //开始播放
            break;
        case GET_PERSONAL_INFO:
            state.info = action.data;
            break;
        case GET_SONG_INFO:
            state.currentSong = action.data;
            state.status = 4; //加载歌曲信息成功
            break;
    }

    return Object.create(state);
}
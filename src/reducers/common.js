/**
 * Created by zhaofeng on 7/11/16.
 */
import ACTIONS from '../constants/actions';

const {
    PLAY,
    PLAY2,
    CLEAR,
    ADD,
    RESUME,
    PAUSE,
    ACTION,
    CHANGE_PLAY_TYPE,
    GET_PERSONAL_INFO,
    GET_SONG_INFO,
    NEXT,
    PREVIOUS,
    SYNC_SONG,
    PLAY_SINGLE
} = ACTIONS;

export default (state = {}, action) => {
    switch (action.type) {
        case PLAY:
            state.playlist = action.data.songs;
            state.current = action.data.current || 0;
            state.status = 1; //加载播放列表成功
            break;
        case PLAY2:
            state.current = action.data.current || 0;
            state.status = 1; //加载播放列表成功
            break;
        case PLAY_SINGLE:
            state.playlist = state.playlist || [];
            state.playlist.push(action.data.song);
            console.log(state.playlist);
            state.current = state.playlist.length - 1;
            state.status = 1; //加载播放列表成功
            break;
        case CLEAR:
            if (action.data.songId) {
                if (action.data.current < state.current) {
                    state.current = state.current - 1;
                }
                state.playlist.splice(action.data.current, 1);
            } else {
                state.playlist = [];
                state.current = 0;
                // state.status = 6; //停止
            }
            break;
        case ADD:
            state.playlist = action.data.songs;
            break;
        case NEXT:
            if (state.playType == 1) {
                state.current = parseInt(Math.random() * state.playlist.length);
            } else if (!state.playType || state.playType == 0) {
                state.current + 1 == state.playlist.length ?
                    state.current = 0 :
                    state.current = state.current + 1;
            }

            state.status = 1; //加载播放列表成功
            break;
        case PREVIOUS:
            if (state.playType == 1) {
                state.current = parseInt(Math.random() * state.playlist.length);
            } else if (!state.playType || state.playType == 0) {
                state.current + 1 == state.playlist.length ?
                    state.current = 0 :
                    state.current = state.current - 1;
            }

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
        case CHANGE_PLAY_TYPE:
            state.playType = state.playType || 0; // 0:顺序 1: 随机 2:重复
            state.playType == 2 ?
                state.playType = 0 :
                state.playType++;
            break;
        case GET_PERSONAL_INFO:
            state.info = action.data;
            break;
        case GET_SONG_INFO:
            state.currentSong = action.data;
            state.status = 4; //加载歌曲信息成功
            break;
        case SYNC_SONG:
            if (state.currentSong) {
                state.currentSong.data.favorite = state.currentSong.data.favorite ? 0 : 1;
            }
            state.status = 0;
            break;
    }

    return Object.create(state);
}
/**
 * Created by zhaofeng on 7/16/16.
 */
import ACTIONS from '../constants/type';

const {
    GET_MY_SONGS,
    GET_MY_ATTENTION,
    GET_MY_FANS,
    GET_ATTENTION_COLLECTION
} = ACTIONS;
export default (state = {}, action) => {
    switch (action.type) {
        case GET_MY_SONGS:
            state.songs = action.data;
            break;
        case GET_MY_ATTENTION:
            if (action.isIncrement) {
                state.attentionUsers = (state.attentionUsers || []).concat(action.data);
            } else {
                state.attentionUsers = action.data;
            }
            break;
        case GET_MY_FANS:
            if (action.isIncrement) {
                state.fans = (state.fans || []).concat(action.data);
            } else {
                state.fans = action.data;
            }
            break;
        case GET_ATTENTION_COLLECTION:
            if (action.isIncrement) {
                state.attentionCollections = (state.attentionCollections || []).concat(action.data);
            } else {
                state.attentionCollections = action.data;
            }
            break;
    }

    return Object.create(state);
}
/**
 * Created by zhaofeng on 7/14/16.
 */
import ACTIONS from '../constants/actions';

const {
    GET_COLLECTIONS,
    GET_COLLECTION,
    GET_COLLECTION_SONG
} = ACTIONS;
export default (state = {}, action) => {
    switch (action.type) {
        case GET_COLLECTIONS:
            if (action.isIncrement) {
                state.collections = (state.collections || []).concat(action.data);
            } else {
                state.collections = action.data;
            }
            break;
        case GET_COLLECTION:
            state.collectionInfo = action.data;
            break;
        case GET_COLLECTION_SONG:
            state.songlist = action.data;
            break;
    }

    return Object.create(state);
}
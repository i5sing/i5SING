/**
 * Created by zhaofeng on 2016/7/24.
 */
import ACTIONS from '../constants/type';

const {
    SEARCH
} = ACTIONS;
export default (state = {}, action) => {
    switch (action.type) {
        case SEARCH:
            if (!state.searchResult) state.searchResult = {};

            if (action.isIncrement) {
                switch (action.searchType) {
                    case 'yc':
                    case 'fc':
                    case 'bz':
                        state.searchResult.songArray = (state.searchResult.songArray || []).concat(action.data.songArray);
                        break;
                    case 'user':
                        state.searchResult.user = (state.searchResult.user || []).concat(action.data.user);
                        break;
                    case 'collection':
                        state.searchResult.songMenu = (state.searchResult.songMenu || []).concat(action.data.songMenu);
                        break;
                }
            } else {
                state.searchResult = action.data;
            }
            break;
    }

    return Object.create(state);
}
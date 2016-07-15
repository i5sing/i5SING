/**
 * Created by zhaofeng on 7/11/16.
 */
import {combineReducers} from 'redux';

import common from './common';
import appearance from './appearance';
import rank from './rank';
import singer from './singer';
import collection from './collection';
import square from './square';

export default combineReducers({
    common: common,
    appearance: appearance,
    rank: rank,
    singer: singer,
    collection: collection,
    square: square
});
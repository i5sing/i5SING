/**
 * Created by zhaofeng on 7/11/16.
 */
import {combineReducers} from 'redux';

import app from './app';
import common from './common';
import appearance from './appearance';
import rank from './rank';
import singer from './singer';
import collection from './collection';
import square from './square';
import favorite from './favorite';
import columns from './columns';
import search from './search';

export default combineReducers({
    app: app,
    common: common,
    favorite: favorite,
    appearance: appearance,
    rank: rank,
    singer: singer,
    collection: collection,
    square: square,
    columns: columns,
    search: search
});
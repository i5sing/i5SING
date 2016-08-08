/**
 * Created by zhaofeng on 2016/8/1.
 */
import {combineReducers} from 'redux';

import core from './modules/core/reducers/core';
import common from './modules/core/reducers/common';
import dashboard from './modules/dashboard/reducers/dashboard';
import rank from './modules/rank/reducers/rank';
import singer from './modules/singer/reducers/singer';
import collection from './modules/collection/reducers/collection';
import square from './modules/square/reducers/square';
import favorite from './modules/favorite/reducers/favorite';
import programa from './modules/programa/reducers/programa';
import search from './modules/search/reducers/search';

export default combineReducers({
    app: core,
    common: common,
    favorite: favorite,
    dashboard: dashboard,
    rank: rank,
    singer: singer,
    collection: collection,
    square: square,
    programa: programa,
    search: search
});
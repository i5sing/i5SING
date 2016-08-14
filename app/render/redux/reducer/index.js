/**
 * Created by zhaofeng on 2016/8/1.
 */
import {combineReducers} from 'redux';

import core from './core';
import common from './common';
import dashboard from './dashboard';
import rank from './rank';
import singer from './singer';
import collection from './collection';
import square from './square';
import favorite from './favorite';
import programa from './programa';
import search from './search';

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
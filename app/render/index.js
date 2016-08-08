/**
 * Created by zhaofeng on 7/11/16.
 */
import React from 'react';
import {Provider} from 'react-redux'
import ReactDom from 'react-dom';
import {Router, hashHistory} from 'react-router'

import {createRedux} from './utils/redux';
import Core from './modules/core';
import "../assets/style/index.less";


let store = createRedux();

let childRoutes = [];
let tempRoutes = [
    require('./modules/dashboard/routes/dashboard'),
    require('./modules/collection/routes/collections'),
    require('./modules/favorite/routes/favorite'),
    require('./modules/programa/routes/programa'),
    require('./modules/rank/routes/rank'),
    require('./modules/search/routes/search'),
    require('./modules/singer/routes/singer'),
    require('./modules/square/routes/square'),
    require('./modules/web/routes/webview')
];

tempRoutes.forEach(route => {
    if (route.length) {
        childRoutes = childRoutes.concat(route);
    } else {
        childRoutes.push(route);
    }
});

let routes = {
    path: '/',
    indexRoutes: {
        component: require('./modules/dashboard/containers/dashboard')
    },
    childRoutes: childRoutes,
    component: Core
};

ReactDom.render(
    <Provider store={store}>
        <Router history={hashHistory} routes={routes}/>
    </Provider>,
    document.getElementById('app')
);